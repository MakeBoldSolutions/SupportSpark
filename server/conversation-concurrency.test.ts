import { afterEach, beforeEach, expect, it } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { FileStorage } from "./storage";
import type { Message } from "@shared/schema";

let root: string;
let store: FileStorage;
const message = (id: string): Message => ({
  id,
  authorId: "owner",
  authorName: "Owner",
  content: id,
  timestamp: "2026-09-21",
  replies: [],
});
beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "supportspark-concurrency-"));
  store = new FileStorage(root);
  await store.getUser("ready");
});
afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true });
});

it("preserves concurrent top-level and nested replies across storage instances", async () => {
  const conversation = await store.createConversation("owner", "Journey", message("initial"));
  const other = new FileStorage(root);
  await other.getUser("ready");
  await Promise.all(
    Array.from({ length: 12 }, (_, i) =>
      (i % 2 ? store : other).updateConversation(conversation.id, (current) => {
        current.data.messages.push(message(`top-${i}`));
        current.data.messages[0].replies!.push(message(`nested-${i}`));
      })
    )
  );
  const persisted = await store.getConversation(conversation.id);
  expect(persisted!.data.messages).toHaveLength(13);
  expect(new Set(persisted!.data.messages[0].replies!.map((m) => m.id)).size).toBe(12);
});
it("releases the lock after a rejected mutation without persisting partial changes", async () => {
  const conversation = await store.createConversation("owner", "Journey", message("initial"));
  await expect(
    store.updateConversation(conversation.id, (current) => {
      current.data.messages.push(message("discarded"));
      throw new Error("rejected");
    })
  ).rejects.toThrow("rejected");
  await store.updateConversation(conversation.id, (current) =>
    current.data.messages.push(message("accepted"))
  );
  expect((await store.getConversation(conversation.id))!.data.messages.map((m) => m.id)).toEqual([
    "initial",
    "accepted",
  ]);
  await expect(store.updateConversation(999, () => {})).rejects.toThrow("Conversation not found");
  expect(await fs.readdir(path.join(root, "conversations"))).not.toContain("999.lock");
});
