import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { storage } from "./local-storage-adapter";
import type { Conversation, Supporter, User } from "@shared/schema";
vi.mock("./seed-data", () => ({ injectSeedData: vi.fn(), DEMO_SUPPORTER_ID: "demo" }));
const users: User[] = ["owner", "friend", "outsider", "demo"].map((id) => ({
  id,
  email: `${id}@example.com`,
  password: "test",
}));
const conversation: Conversation = {
  id: 1,
  memberId: "owner",
  title: "Journey",
  createdAt: "2026-09-21",
  data: { messages: [] },
};
const relation: Supporter = {
  id: 1,
  memberId: "owner",
  supporterId: "friend",
  status: "accepted",
  createdAt: "2026-09-21",
};
function set(key: string, value: unknown) {
  localStorage.setItem(`supportSpark_${key}`, JSON.stringify(value));
}
beforeEach(() => {
  storage.resetAllData();
  set("users", users);
  set("conversations", [conversation]);
  set("session", "friend");
  set("supporters", [relation]);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("rejects stale sessions and unknown conversations", () => {
  set("session", "missing");
  expect(storage.getCurrentUser()).toBeNull();
  expect(() => storage.getConversations()).toThrow("Not authenticated");
  set("session", "friend");
  expect(storage.getConversation(999)).toBeNull();
  expect(() => storage.addMessage(999, { content: "missing" })).toThrow("Conversation not found");
});
it.each(["pending", "rejected"])("denies access for %s relationships", (status) => {
  set("supporters", [{ ...relation, status }]);
  expect(storage.getConversations()).toEqual([]);
  expect(() => storage.getConversation(1)).toThrow("access");
  expect(() => storage.addMessage(1, { content: "denied" })).toThrow("access");
});
it("allows accepted preview relationships in either direction", () => {
  for (const edge of [relation, { ...relation, memberId: "friend", supporterId: "owner" }]) {
    set("supporters", [edge]);
    expect(storage.getConversations().map((c) => c.id)).toEqual([1]);
    expect(storage.getConversation(1)?.title).toBe("Journey");
    const updated = storage.addMessage(1, { content: "Support", images: ["/image.png"] });
    expect(updated.data.messages.at(-1)?.authorName).toBe("friend@example.com");
  }
});
it("denies unrelated accepted relationships and permits the owner", () => {
  set("session", "outsider");
  expect(() => storage.getConversation(1)).toThrow("access");
  expect(() => storage.addMessage(1, { content: "denied" })).toThrow("access");
  set("session", "owner");
  expect(storage.getConversation(1)?.id).toBe(1);
  expect(
    storage.createConversation({ title: "Another", initialMessage: "Hello" }).data.messages[0]
      .authorName
  ).toBe("owner@example.com");
});
it("handles missing people in relationship lists and unknown relationship ids", () => {
  set("supporters", [
    { ...relation, memberId: "missing", supporterId: "friend" },
    { ...relation, id: 2, memberId: "friend", supporterId: "missing" },
  ]);
  const result = storage.getSupporters();
  expect(result.supporting[0].memberName).toBeUndefined();
  expect(result.mySupporters[0].supporterEmail).toBeUndefined();
  expect(() => storage.updateSupporterStatus(999, "accepted")).toThrow("not found");
});
it("logs into an available demo account and rejects missing demo data", () => {
  expect(storage.loginDemoSupporter().id).toBe("demo");
  set("users", []);
  expect(() => storage.loginDemoSupporter()).toThrow("not available");
});
it("reports browser storage quota and handles unavailable storage", async () => {
  vi.stubGlobal("navigator", { storage: { estimate: async () => ({ usage: 80, quota: 100 }) } });
  expect(await storage.getStorageUsagePercent()).toBe(80);
  vi.stubGlobal("navigator", { storage: { estimate: async () => ({}) } });
  expect(await storage.getStorageUsagePercent()).toBeGreaterThanOrEqual(0);
  vi.stubGlobal("navigator", {});
  expect(await storage.getStorageUsagePercent()).toBeGreaterThanOrEqual(0);
  vi.stubGlobal("localStorage", {
    setItem: () => {
      throw new Error("Quota exceeded");
    },
  });
  expect(storage.isStorageAvailable()).toBe(false);
});
