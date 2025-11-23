import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import { useAuth } from "../../context/AuthContext.js";

jest.mock("../../context/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

const renderWithRoutes = () =>
  render(
    <MemoryRouter initialEntries={["/movies"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/movies" element={<div>Private Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to the login page when the user is not authenticated", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isAuthenticating: false,
      hasHydrated: true,
    });

    renderWithRoutes();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Private Content")).not.toBeInTheDocument();
  });

  it("renders the protected content when the user is authenticated", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isAuthenticating: false,
      hasHydrated: true,
    });

    renderWithRoutes();

    expect(screen.getByText("Private Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});
