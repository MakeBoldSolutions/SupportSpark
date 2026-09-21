import { afterEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreviewBanner } from "./preview-banner";
const state = vi.hoisted(() => ({ authenticated: false, usage: 0, reset: vi.fn() }));
vi.mock("@/lib/local-storage-adapter", () => ({
  storage: {
    getCurrentUser: () => (state.authenticated ? { id: "owner" } : null),
    getStorageUsagePercent: async () => state.usage,
    resetAllData: state.reset,
  },
}));
afterEach(() => {
  vi.unstubAllGlobals();
});
it("shows local-storage disclosure without reset for visitors", () => {
  state.authenticated = false;
  state.usage = 0;
  render(<PreviewBanner />);
  expect(screen.getByText("All data is stored locally in your browser.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Reset Demo Data" })).not.toBeInTheDocument();
});
it("warns about storage capacity and resets signed-in preview data", async () => {
  state.authenticated = true;
  state.usage = 90;
  render(<PreviewBanner />);
  expect(await screen.findByText("Storage nearly full")).toBeInTheDocument();
  // jsdom does not implement full navigation; verify the requested reset/reload.
  const originalWindow = window;
  const location = { hash: "", reload: vi.fn() };
  const button = screen.getByRole("button", { name: "Reset Demo Data" });
  const user = userEvent.setup();
  vi.stubGlobal(
    "window",
    new Proxy(originalWindow, {
      get(target, key) {
        return key === "location" ? location : Reflect.get(target, key);
      },
    })
  );
  await user.click(button);
  expect(state.reset).toHaveBeenCalled();
  expect(location.hash).toBe("#/");
  expect(location.reload).toHaveBeenCalled();
});
