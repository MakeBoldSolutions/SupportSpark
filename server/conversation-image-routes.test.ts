import { afterAll, beforeAll, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { Conversation, Supporter, User } from "@shared/schema";
import { registerConversationImageRoutes } from "./conversation-image-routes";

const conversation: Conversation = {
  id: 1,
  memberId: "owner",
  title: "Private",
  createdAt: "2026-09-21",
  data: { messages: [] },
};
const store = {
  getConversation: vi.fn(async (id: number) => (id === 1 ? conversation : undefined)),
  getSupporterRecord: vi.fn(
    async (_member: string, user: string): Promise<Supporter | undefined> =>
      ["accepted", "pending", "rejected"].includes(user)
        ? {
            id: 1,
            memberId: "owner",
            supporterId: user,
            status: user as Supporter["status"],
            createdAt: "2026-09-21",
          }
        : undefined
  ),
};
const app = express();
let root: string;
beforeAll(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "supportspark-images-"));
  registerConversationImageRoutes(
    app,
    store,
    (req, res, next) => {
      const id = req.get("x-test-user");
      if (!id) {
        res.sendStatus(401);
        return;
      }
      req.user = { id, email: "test@example.com", password: "unused" } as User;
      next();
    },
    root
  );
  app.use(((err, _req, res, _next) =>
    res.status(400).json({ message: err.message })) as express.ErrorRequestHandler);
});
afterAll(async () => {
  await fs.rm(root, { recursive: true, force: true });
});

it("requires authentication before reading or uploading images", async () => {
  await request(app).get("/api/conversations/1/images/photo.png").expect(401);
  await request(app).post("/api/conversations/1/images").expect(401);
});
it.each(["outsider", "pending", "rejected"])("denies downloads for %s", async (user) => {
  await request(app)
    .get("/api/conversations/1/images/photo.png")
    .set("x-test-user", user)
    .expect(403);
});
it("allows only owner uploads, and owner or accepted supporter downloads", async () => {
  await request(app)
    .post("/api/conversations/1/images")
    .set("x-test-user", "accepted")
    .attach("images", Buffer.from("image fixture"), "photo.png")
    .expect(403);
  const upload = await request(app)
    .post("/api/conversations/1/images")
    .set("x-test-user", "owner")
    .attach("images", Buffer.from("image fixture"), "photo.png")
    .expect(200);
  for (const user of ["owner", "accepted"]) {
    const result = await request(app)
      .get(upload.body.images[0])
      .set("x-test-user", user)
      .expect(200);
    expect(result.body.toString()).toBe("image fixture");
    expect(result.headers["cache-control"]).toBe("private, no-store");
  }
});
it("rejects missing conversations, missing files and unsafe filenames", async () => {
  await request(app)
    .get("/api/conversations/999/images/photo.png")
    .set("x-test-user", "owner")
    .expect(404);
  await request(app).post("/api/conversations/999/images").set("x-test-user", "owner").expect(404);
  await request(app)
    .get("/api/conversations/1/images/missing.png")
    .set("x-test-user", "owner")
    .expect(404);
  await request(app)
    .get("/api/conversations/1/images/..secret.png")
    .set("x-test-user", "owner")
    .expect(400);
});
it("rejects unsupported file types and oversized uploads", async () => {
  await request(app)
    .post("/api/conversations/1/images")
    .set("x-test-user", "owner")
    .attach("images", Buffer.from("script"), "payload.html")
    .expect(400);
  await request(app)
    .post("/api/conversations/1/images")
    .set("x-test-user", "owner")
    .attach("images", Buffer.alloc(5 * 1024 * 1024 + 1), "large.png")
    .expect(400);
});
