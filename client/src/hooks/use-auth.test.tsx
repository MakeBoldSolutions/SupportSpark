import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { storage } from "@/lib/local-storage-adapter";
import React from "react";

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock seed-data dynamic import to avoid side effects
vi.mock("@/lib/seed-data", () => ({
  injectSeedData: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "Wrapper";
  return Wrapper;
}

describe("useAuth", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  describe("user query", () => {
    it("should return null when not authenticated", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.user).toBeNull();
    });

    it("should return user data when authenticated", async () => {
      // Pre-register a user to set session
      storage.register({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.user).toBeTruthy();
      expect(result.current.user?.email).toBe("test@example.com");
      expect(result.current.user?.firstName).toBe("Test");
    });
  });

  describe("loginMutation", () => {
    it("should login successfully", async () => {
      // Register a user first
      storage.register({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
      });
      storage.logout();

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.loginMutation.mutate({
          email: "test@example.com",
          password: "password123",
        });
      });

      await waitFor(() => {
        expect(result.current.loginMutation.isSuccess).toBe(true);
      });
    });

    it("should handle login errors for wrong credentials", async () => {
      storage.register({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
      });
      storage.logout();

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.loginMutation.mutate({
          email: "test@example.com",
          password: "wrongpassword",
        });
      });

      await waitFor(() => {
        expect(result.current.loginMutation.isError).toBe(true);
      });
    });
  });

  describe("registerMutation", () => {
    it("should register successfully", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.registerMutation.mutate({
          email: "new@example.com",
          password: "password123",
          firstName: "New",
        });
      });

      await waitFor(() => {
        expect(result.current.registerMutation.isSuccess).toBe(true);
      });
      expect(result.current.user?.email).toBe("new@example.com");
    });

    it("should fail for duplicate email", async () => {
      storage.register({
        email: "dupe@example.com",
        password: "password123",
        firstName: "First",
      });
      storage.logout();

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.registerMutation.mutate({
          email: "dupe@example.com",
          password: "password456",
          firstName: "Second",
        });
      });

      await waitFor(() => {
        expect(result.current.registerMutation.isError).toBe(true);
      });
    });
  });

  describe("logoutMutation", () => {
    it("should logout successfully", async () => {
      storage.register({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
      });

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });

      await act(async () => {
        result.current.logoutMutation.mutate();
      });

      await waitFor(() => {
        expect(result.current.logoutMutation.isSuccess).toBe(true);
      });
      expect(storage.getCurrentUser()).toBeNull();
    });
  });
});
