import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import Login from "./Login.js";
import { useAuth } from "../../context/AuthContext.js";

vi.mock("../../context/AuthContext.js", () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () =>
  render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      initialEntries={["/login"]}
    >
      <Login />
    </MemoryRouter>
  );

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits credentials and navigates on success", async () => {
    const loginMock = vi.fn().mockResolvedValue({ id: "123" });

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
    const loginMock = vi.fn().mockRejectedValue(new Error("Invalid credentials"));

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
