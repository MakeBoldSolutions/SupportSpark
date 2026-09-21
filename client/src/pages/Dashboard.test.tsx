import { beforeEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Conversation } from "@shared/schema";
import Dashboard from "./Dashboard";
const state = vi.hoisted(() => ({ data: [] as Conversation[], isLoading: false }));
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { id: "owner", firstName: "Jane" },
    logoutMutation: { mutate: vi.fn() },
  }),
}));
vi.mock("@/hooks/use-conversations", () => ({
  useConversations: () => state,
  useCreateConversation: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
beforeEach(() => {
  state.data = [];
  state.isLoading = false;
});
it("renders empty states and opens the real create-update dialog", async () => {
  render(<Dashboard />);
  expect(screen.getByText("No updates yet")).toBeInTheDocument();
  expect(screen.getByText("Not following anyone yet")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /post update/i }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
it("separates owned and followed updates with links to conversations", () => {
  state.data = ["owner", "friend"].map((memberId, i) => ({
    id: i + 1,
    memberId,
    title: `${memberId} journey`,
    createdAt: "2026-09-21",
    memberName: "Friend",
    data: {
      messages: [
        {
          id: "m",
          authorId: memberId,
          authorName: "Name",
          timestamp: "2026-09-21",
          content: "**Good** *news* [today](https://example.com)",
        },
      ],
    },
  }));
  render(<Dashboard />);
  expect(screen.getByText("My Update")).toBeInTheDocument();
  expect(screen.getByText("From Friend")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /owner journey/i })).toHaveAttribute(
    "href",
    "/conversation/1"
  );
});
it("shows loading placeholders without claiming there are no updates", () => {
  state.isLoading = true;
  render(<Dashboard />);
  expect(screen.queryByText("No updates yet")).not.toBeInTheDocument();
});
