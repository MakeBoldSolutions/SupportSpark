import { afterEach, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { reducer, toast, useToast } from "./use-toast";
import { useIsMobile } from "./use-mobile";

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
it("updates, dismisses and removes toast notifications", () => {
  vi.useFakeTimers();
  const { result, unmount } = renderHook(() => useToast());
  let notification: ReturnType<typeof toast>;
  act(() => { notification = toast({ title: "Saved" }); });
  expect(result.current.toasts[0].title).toBe("Saved");
  act(() => { notification.update({ id: notification.id, title: "Updated" }); });
  expect(result.current.toasts[0].title).toBe("Updated");
  act(() => { result.current.toasts[0].onOpenChange?.(true); notification.dismiss(); notification.dismiss(); });
  expect(result.current.toasts[0].open).toBe(false);
  act(() => { vi.advanceTimersByTime(1000000); });
  expect(result.current.toasts).toHaveLength(0);
  act(() => { toast({ title: "Again" }); });
  act(() => { result.current.toasts[0].onOpenChange?.(false); result.current.dismiss(); });
  act(() => { vi.advanceTimersByTime(1000000); });
  expect(result.current.toasts).toHaveLength(0);
  unmount();
});
it("keeps unrelated notifications when updating or removing by id", () => {
  vi.useFakeTimers();
  const state = { toasts: [{ id: "a", title: "A", open: true }, { id: "b", title: "B", open: true }] };
  expect(reducer(state, { type: "UPDATE_TOAST", toast: { id: "a", title: "New" } }).toasts[1].title).toBe("B");
  expect(reducer(state, { type: "DISMISS_TOAST", toastId: "a" }).toasts[1].open).toBe(true);
  expect(reducer(state, { type: "DISMISS_TOAST" }).toasts.every((t) => !t.open)).toBe(true);
  expect(reducer(state, { type: "REMOVE_TOAST", toastId: "a" }).toasts.map((t) => t.id)).toEqual(["b"]);
  expect(reducer(state, { type: "REMOVE_TOAST" }).toasts).toEqual([]);
  vi.runAllTimers();
});
it("tracks breakpoint changes and removes the listener on unmount", () => {
  let change: () => void = () => {};
  const media = { matches: false, addEventListener: vi.fn((_event: string, listener: () => void) => { change = listener; }), removeEventListener: vi.fn() };
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  const { result, unmount } = renderHook(() => useIsMobile());
  expect(result.current).toBe(false);
  act(() => { media.matches = true; change(); });
  expect(result.current).toBe(true);
  unmount(); expect(media.removeEventListener).toHaveBeenCalledWith("change", change);
});
