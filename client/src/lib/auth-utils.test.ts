import { expect, it, vi } from "vitest";
import { isUnauthorizedError, redirectToLogin } from "./auth-utils";
it("recognizes unauthorized errors and redirects with an optional notice", () => {
  expect(isUnauthorizedError(new Error("401: Unauthorized"))).toBe(true);
  expect(isUnauthorizedError(new Error("500: Failed"))).toBe(false);
  vi.useFakeTimers();
  const location = { href: "/" };
  vi.stubGlobal("window", { location });
  try {
    const toast = vi.fn(); redirectToLogin(toast);
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Unauthorized" }));
    vi.advanceTimersByTime(500); expect(location.href).toBe("/api/login");
    location.href = "/"; redirectToLogin(); vi.advanceTimersByTime(500);
    expect(location.href).toBe("/api/login");
  } finally { vi.useRealTimers(); vi.unstubAllGlobals(); }
});
