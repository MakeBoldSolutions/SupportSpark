import { afterAll, beforeAll, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { registerRoutes } from "./routes";
import { FileStorage } from "./storage";
import fs from "fs/promises";
import os from "os";
import path from "path";
let root: string;

const app = express();
const server = createServer(app);
const owner = request.agent(app);
const supporter = request.agent(app);
const outsider = request.agent(app);
const email = (name: string) => `${name}-${randomUUID()}@example.com`;
const ownerEmail = email("owner");
const supporterEmail = email("supporter");
let id: number;
let initialId: string;
let invitationId: number;
beforeAll(async () => {
  process.env.SESSION_SECRET = "test-only-secret";
  app.use(express.json());
  root = await fs.mkdtemp(path.join(os.tmpdir(), "supportspark-api-"));
  await registerRoutes(server, app, new FileStorage(root));
  app.use(((err, _req, res, _next) =>
    res.status(err.status || 400).json({ message: err.message })) as express.ErrorRequestHandler);
  for (const [agent, address] of [
    [owner, ownerEmail],
    [supporter, supporterEmail],
    [outsider, email("outsider")],
  ] as const) {
    await agent
      .post("/api/register")
      .send({ email: address, password: "Testing123!", firstName: "Test", lastName: "User" })
      .expect(201);
  }
  const result = await owner
    .post("/api/conversations")
    .send({ title: "Private journey", initialMessage: "First update" })
    .expect(201);
  id = result.body.id;
  initialId = result.body.data.messages[0].id;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await fs.rm(root, { recursive: true, force: true });
});

it("rejects anonymous and unrelated users for conversation reads and writes", async () => {
  await request(app).get("/api/conversations").expect(401);
  await outsider.get(`/api/conversations/${id}`).expect(403);
  await outsider
    .post(`/api/conversations/${id}/messages`)
    .send({ content: "Intrusion" })
    .expect(403);
  await owner.get("/api/conversations/99999999").expect(404);
  await owner.post("/api/conversations/99999999/messages").send({ content: "Missing" }).expect(404);
  await owner.post("/api/conversations").send({}).expect(400);
});
it("enforces invitation ownership and acceptance before access", async () => {
  await owner.post("/api/supporters/invite").send({ email: ownerEmail }).expect(400);
  await owner
    .post("/api/supporters/invite")
    .send({ email: email("missing") })
    .expect(404);
  const invitation = await owner
    .post("/api/supporters/invite")
    .send({ email: supporterEmail })
    .expect(201);
  invitationId = invitation.body.id;
  await owner.post("/api/supporters/invite").send({ email: supporterEmail }).expect(400);
  await supporter.get(`/api/conversations/${id}`).expect(403);
  await outsider
    .patch(`/api/supporters/${invitationId}/status`)
    .send({ status: "accepted" })
    .expect(404);
  const pending = await supporter.get("/api/supporters").expect(200);
  expect(pending.body.supporting.some((s: { id: number }) => s.id === invitationId)).toBe(true);
  await supporter
    .patch(`/api/supporters/${invitationId}/status`)
    .send({ status: "accepted" })
    .expect(200);
  await supporter.get(`/api/conversations/${id}`).expect(200);
  const list = await supporter.get("/api/conversations").expect(200);
  expect(list.body.some((c: { id: number }) => c.id === id)).toBe(true);
  expect((await owner.get("/api/supporters").expect(200)).body.mySupporters[0].supporterEmail).toBe(
    supporterEmail
  );
});
it("preserves simultaneous replies through the actual HTTP API", async () => {
  await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      (i % 2 ? owner : supporter)
        .post(`/api/conversations/${id}/messages`)
        .send({ content: `Reply ${i}`, parentMessageId: initialId })
        .expect(200)
    )
  );
  const result = await owner.get(`/api/conversations/${id}`).expect(200);
  const replies = result.body.data.messages[0].replies;
  expect(new Set(replies.map((m: { content: string }) => m.content)).size).toBe(8);
  await owner
    .post(`/api/conversations/${id}/messages`)
    .send({ content: "Nested", parentMessageId: replies[0].id, images: ["/photo.png"] })
    .expect(200);
  await owner
    .post(`/api/conversations/${id}/messages`)
    .send({ content: "Missing parent", parentMessageId: "missing" })
    .expect(404);
  await owner.post(`/api/conversations/${id}/messages`).send({ content: "Top-level" }).expect(200);
});
it("revokes access when the supporter rejects the relationship", async () => {
  await supporter
    .patch(`/api/supporters/${invitationId}/status`)
    .send({ status: "rejected" })
    .expect(200);
  await supporter.get(`/api/conversations/${id}`).expect(403);
  await supporter.post(`/api/conversations/${id}/messages`).send({ content: "Denied" }).expect(403);
  await supporter.get(`/api/conversations/${id}/images/known.png`).expect(403);
});
it("supports authenticated identity, logout and both demo roles", async () => {
  const current = await owner.get("/api/auth/user").expect(200);
  expect(current.body.email).toBe(ownerEmail);
  expect(current.body).not.toHaveProperty("password");
  await owner.post("/api/logout").expect(200);
  await owner.get("/api/auth/user").expect(401);
  await request(app).get("/api/demo/info").expect(200);
  for (const role of ["patient", "supporter"]) {
    const demo = await owner.post(`/api/demo/login/${role}`).expect(200);
    expect(demo.body.isDemo).toBe(true);
    expect(demo.body).not.toHaveProperty("password");
  }
});
