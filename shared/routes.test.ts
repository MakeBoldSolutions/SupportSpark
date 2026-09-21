import { expect, it } from "vitest";
import { buildUrl } from "./routes";
it("substitutes route parameters without changing routes that have none", () => {
  expect(buildUrl("/api/conversations/:id", { id: 12, unused: "value" })).toBe(
    "/api/conversations/12"
  );
  expect(buildUrl("/api/health")).toBe("/api/health");
});
