import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login.js";
import { useAuth } from "../../context/AuthContext.js";

jest.mock("../../context/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Login />
    </MemoryRouter>
  );

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits credentials and navigates on success", async () => {
    const loginMock = jest.fn().mockResolvedValue({ id: "123" });

    useAuth.mockReturnValue({
      login: loginMock,
      isAuthenticated: false,
      isAuthenticating: false,
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "gary@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getAllByText(/sign in/i)[1]);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        "gary@example.com",
        "Password123"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("displays an error message when login fails", async () => {
    const loginMock = jest.fn().mockRejectedValue(new Error("Invalid credentials"));

    useAuth.mockReturnValue({
      login: loginMock,
      isAuthenticated: false,
      isAuthenticating: false,
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "gary@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getAllByText(/sign in/i)[1]);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
