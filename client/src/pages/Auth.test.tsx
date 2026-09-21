import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Auth from "./Auth";
const auth = vi.hoisted(() => ({
  user: null,
  loginMutation: { mutate: vi.fn(), isPending: false },
  registerMutation: { mutate: vi.fn(), isPending: false },
}));
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => auth }));
beforeEach(() => {
  vi.clearAllMocks();
  auth.loginMutation.isPending = false;
  auth.registerMutation.isPending = false;
});
describe("Auth page", () => {
  it("submits credentials from the real login form", async () => {
    const user = userEvent.setup();
    render(<Auth />);
    await user.type(screen.getByLabelText("Email"), "reader@example.com");
    await user.type(screen.getByLabelText("Password"), "Secret123!");
    await user.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() =>
      expect(auth.loginMutation.mutate).toHaveBeenCalledWith({
        email: "reader@example.com",
        password: "Secret123!",
      })
    );
  });
  it("validates registration and submits a valid account", async () => {
    const user = userEvent.setup();
    render(<Auth />);
    await user.click(screen.getByRole("tab", { name: "Register" }));
    await user.click(screen.getByRole("button", { name: "Register" }));
    expect(auth.registerMutation.mutate).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByLabelText("Password")).toHaveAttribute("aria-invalid", "true")
    );
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "Secret123!");
    await user.type(screen.getByLabelText("First Name"), "Jane");
    await user.type(screen.getByLabelText("Last Name"), "Doe");
    await user.click(screen.getByRole("button", { name: "Register" }));
    await waitFor(() =>
      expect(auth.registerMutation.mutate).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "Secret123!",
        firstName: "Jane",
        lastName: "Doe",
      })
    );
  });
  it("disables submission while a login is pending", () => {
    auth.loginMutation.isPending = true;
    render(<Auth />);
    expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled();
  });
});
