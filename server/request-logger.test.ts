import { expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import { requestLogger } from "./request-logger";

it("logs metadata without request identifiers, query strings or response content", async () => {
  const write = vi.fn();
  const app = express();
  app.use(express.json(), requestLogger(write));
  app.post("/api/conversations/:id", (_req, res) => res.json({ content: "private update" }));
  await request(app)
    .post("/api/conversations/private-id?email=private@example.com")
    .send({ password: "private password" })
    .expect(200);
  expect(write).toHaveBeenCalledOnce();
  expect(write.mock.calls[0][0]).toMatch(/^POST \/api\/conversations\/:id 200 in \d+ms$/);
  await request(app).get("/api/missing/private-id").expect(404);
  expect(write.mock.calls[1][0]).toMatch(/^GET \/api\/\* 404 in \d+ms$/);
  await request(app).get("/public").expect(404);
  expect(write).toHaveBeenCalledTimes(2);
});
