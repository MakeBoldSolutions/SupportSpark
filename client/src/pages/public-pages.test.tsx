import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./Home";
import Demo from "./Demo";
import NotFound from "./not-found";
import { Navbar } from "@/components/navbar";
import { storage } from "@/lib/local-storage-adapter";
import type { ReactNode } from "react";
import type { User } from "@shared/schema";
// Exercise page state without waiting for animation exit timers in jsdom.
vi.mock("framer-motion", async (original) => ({
  ...(await original<typeof import("framer-motion")>()),
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}));
const auth = vi.hoisted(() => ({ user: null as User | null, logoutMutation: { mutate: vi.fn() } }));
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => auth }));
vi.mock("@/lib/seed-data", () => ({ injectSeedData: vi.fn() }));
beforeEach(() => {
  auth.user = null;
  window.history.replaceState({}, "", "/");
  vi.stubGlobal("scrollTo", vi.fn());
  vi.stubGlobal("__APP_VERSION__", "test");
  vi.stubGlobal("__BUILD_DATE__", "2026-09-21");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("offers public entry points and an authenticated dashboard link", () => {
  const view = render(<Home />);
  expect(screen.getByRole("button", { name: "Start Your Journey" }).closest("a")).toHaveAttribute(
    "href",
    "/auth"
  );
  auth.user = { id: "owner", email: "owner@example.com", password: "unused", firstName: "Jane" };
  view.rerender(<Home />);
  expect(screen.getByRole("button", { name: "Go to Your Dashboard" }).closest("a")).toHaveAttribute(
    "href",
    "/dashboard"
  );
});
it("rotates the home-page quote over time", async () => {
  vi.useFakeTimers();
  const view = render(<Home />);
  const before = view.container.textContent;
  await act(async () => {
    await vi.advanceTimersByTimeAsync(60000);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000);
  });
  expect(view.container.textContent).not.toBe(before);
  view.unmount();
});
it("opens and closes mobile navigation and signs out", async () => {
  auth.user = { id: "owner", email: "owner@example.com", password: "unused" };
  const view = render(<Navbar />);
  const toggle = view.container.querySelector("button.md\\:hidden")!;
  await userEvent.click(toggle);
  expect(screen.getAllByRole("link", { name: "Dashboard" })).toHaveLength(2);
  await userEvent.click(screen.getAllByRole("button", { name: "Sign Out" })[1]);
  expect(auth.logoutMutation.mutate).toHaveBeenCalled();
  await userEvent.click(screen.getAllByRole("link", { name: "Dashboard" })[1]);
  await waitFor(() => expect(screen.getAllByRole("link", { name: "Dashboard" })).toHaveLength(1));
});
it("provides mobile sign-in for visitors", async () => {
  const view = render(<Navbar />);
  await userEvent.click(view.container.querySelector("button.md\\:hidden")!);
  expect(screen.getByRole("button", { name: "Sign In" }).closest("a")).toHaveAttribute(
    "href",
    "/auth"
  );
  await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
});
it("navigates the demo tour in both directions and restarts it", async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Demo />
    </QueryClientProvider>
  );
  expect(screen.getByTestId("button-prev-step")).toBeDisabled();
  await userEvent.click(screen.getByTestId("button-next-step"));
  await userEvent.click(screen.getByTestId("button-prev-step"));
  await userEvent.click(screen.getByTestId("step-indicator-4"));
  await userEvent.click(screen.getByTestId("button-restart-tour"));
  expect(screen.getByTestId("button-prev-step")).toBeDisabled();
  await userEvent.click(screen.getByTestId("button-create-account"));
  expect(window.location.pathname).toBe("/auth");
});
it.each(["patient", "supporter"])("handles demo %s entry and missing demo data", async (role) => {
  const login = vi
    .spyOn(storage, "loginDemoSupporter")
    .mockReturnValue({ id: "demo", email: "demo@example.com", password: "unused" });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Demo />
    </QueryClientProvider>
  );
  await userEvent.click(screen.getByTestId(`button-login-${role}`));
  expect(window.location.pathname).toBe("/dashboard");
  login.mockImplementation(() => {
    throw new Error("missing");
  });
  await userEvent.click(screen.getByTestId(`button-login-${role}`));
  expect(window.location.pathname).toBe("/auth");
});
it("renders a not-found page", () => {
  render(<NotFound />);
  expect(screen.getByText(/404/)).toBeInTheDocument();
});
