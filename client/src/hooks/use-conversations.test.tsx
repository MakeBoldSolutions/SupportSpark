import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useAddMessage,
} from "./use-conversations";
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

describe("useConversations", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  it("should fetch all conversations for authenticated user", async () => {
    registerTestUser();
    storage.createConversation({ title: "Update 1", initialMessage: "Hello" });

    const { result } = renderHook(() => useConversations(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].title).toBe("Update 1");
  });

  it("should return empty array when no conversations exist", async () => {
    registerTestUser();

    const { result } = renderHook(() => useConversations(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toHaveLength(0);
  });
});

describe("useConversation", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  it("should fetch single conversation by ID", async () => {
    registerTestUser();
    const conv = storage.createConversation({ title: "My Update", initialMessage: "Content" });

    const { result } = renderHook(() => useConversation(conv.id), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.title).toBe("My Update");
    expect(result.current.data?.data.messages).toHaveLength(1);
  });

  it("should return null for non-existent conversation", async () => {
    registerTestUser();

    const { result } = renderHook(() => useConversation(999), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toBeNull();
  });
});

describe("useCreateConversation", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  it("should create a new conversation", async () => {
    registerTestUser();

    const { result } = renderHook(() => useCreateConversation(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({
        title: "New Update",
        initialMessage: "Initial message",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.title).toBe("New Update");
    expect(result.current.data?.data.messages[0].content).toBe("Initial message");
  });

  it("should fail when not authenticated", async () => {
    const { result } = renderHook(() => useCreateConversation(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({
        title: "New Update",
        initialMessage: "Initial message",
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useAddMessage", () => {
  beforeEach(() => {
    storage.resetAllData();
  });

  it("should add a message to conversation", async () => {
    registerTestUser();
    const conv = storage.createConversation({ title: "Test", initialMessage: "First" });

    const { result } = renderHook(() => useAddMessage(conv.id), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ content: "Second message" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.data.messages).toHaveLength(2);
    expect(result.current.data?.data.messages[1].content).toBe("Second message");
  });

  it("should include author info in added message", async () => {
    const user = registerTestUser();
    const conv = storage.createConversation({ title: "Test", initialMessage: "First" });

    const { result } = renderHook(() => useAddMessage(conv.id), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ content: "New message" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.data.messages[1].authorId).toBe(user.id);
    expect(result.current.data?.data.messages[1].authorName).toBe("Test");
  });
});
