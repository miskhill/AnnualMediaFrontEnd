import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import ProtectedRoute from "./ProtectedRoute.js";
import { useAuth } from "../../context/AuthContext.js";

vi.mock("../../context/AuthContext.js", () => ({
  useAuth: vi.fn(),
}));

const renderWithRoutes = () =>
  render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      initialEntries={["/movies"]}
    >
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
    vi.clearAllMocks();
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
