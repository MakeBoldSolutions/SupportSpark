import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useSupporters, useInviteSupporter, useUpdateSupporterStatus } from "./use-supporters";
import { storage } from "@/lib/local-storage-adapter";

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

function registerTestUser() {
  return storage.register({
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
  });
}

describe("useSupporters", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  it("should return empty supporters when none exist", async () => {
    registerTestUser();

    const { result } = renderHook(() => useSupporters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.mySupporters).toHaveLength(0);
    expect(result.current.data?.supporting).toHaveLength(0);
  });

  it("should return supporters after invite", async () => {
    registerTestUser();
    storage.inviteSupporter({ email: "friend@example.com" });

    const { result } = renderHook(() => useSupporters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    // Bidirectional: mySupporters has the invited user, supporting has the reverse
    expect(result.current.data?.mySupporters).toHaveLength(1);
    expect(result.current.data?.supporting).toHaveLength(1);
  });
});

describe("useInviteSupporter", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  it("should invite a supporter by email", async () => {
    registerTestUser();

    const { result } = renderHook(() => useInviteSupporter(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: "supporter@example.com" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.status).toBe("accepted");
  });

  it("should auto-create mock user for unknown email", async () => {
    registerTestUser();

    const { result } = renderHook(() => useInviteSupporter(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: "newperson@example.com" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    // The mock user should now be loginable
    storage.logout();
    const mockUser = storage.login({ email: "newperson@example.com", password: "preview123" });
    expect(mockUser.firstName).toBe("Newperson");
  });

  it("should fail when not authenticated", async () => {
    const { result } = renderHook(() => useInviteSupporter(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: "supporter@example.com" });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useUpdateSupporterStatus", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  it("should accept a supporter invitation", async () => {
    registerTestUser();
    const supporter = storage.inviteSupporter({ email: "friend@example.com" });

    const { result } = renderHook(() => useUpdateSupporterStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: supporter.id, status: "accepted" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.status).toBe("accepted");
  });

  it("should reject a supporter invitation", async () => {
    registerTestUser();
    const supporter = storage.inviteSupporter({ email: "friend@example.com" });

    const { result } = renderHook(() => useUpdateSupporterStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: supporter.id, status: "rejected" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.status).toBe("rejected");
  });

  it("should fail for non-existent supporter", async () => {
    registerTestUser();

    const { result } = renderHook(() => useUpdateSupporterStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: 999, status: "accepted" });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
