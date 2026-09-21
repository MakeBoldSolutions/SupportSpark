import { beforeEach, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Supporters from "./Supporters";
import type { Supporter } from "@shared/schema";
type Relation = Supporter & {
  supporterName?: string;
  supporterEmail?: string;
  memberName?: string;
};
const state = vi.hoisted(() => ({
  data: { mySupporters: [] as Relation[], supporting: [] as Relation[] },
  isLoading: false,
}));
const invite = vi.hoisted(() => ({ mutateAsync: vi.fn(), isPending: false }));
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { id: "owner", firstName: "Jane" },
    logoutMutation: { mutate: vi.fn() },
  }),
}));
vi.mock("@/hooks/use-supporters", () => ({
  useSupporters: () => state,
  useInviteSupporter: () => invite,
}));
beforeEach(() => {
  state.data = { mySupporters: [], supporting: [] };
  state.isLoading = false;
  vi.clearAllMocks();
});
it("renders both empty states", async () => {
  render(<Supporters />);
  expect(screen.getByText(/haven.t added any supporters/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: "People I Support" }));
  expect(screen.getByText(/aren.t following anyone/i)).toBeInTheDocument();
});
it("renders active and pending relationships separately", async () => {
  const relation = { id: 1, memberId: "owner", supporterId: "friend", createdAt: "2026-09-21" };
  state.data = {
    mySupporters: [
      { ...relation, status: "accepted", supporterName: "Alex" },
      { ...relation, id: 2, status: "pending", supporterEmail: "new@example.com" },
    ],
    supporting: [{ ...relation, status: "accepted", memberName: "Taylor" }],
  };
  render(<Supporters />);
  expect(screen.getByText("Alex")).toBeInTheDocument();
  expect(screen.getByText("new@example.com")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: "People I Support" }));
  expect(screen.getByText("Taylor")).toBeInTheDocument();
});
it("submits an invitation through the actual dialog", async () => {
  invite.mutateAsync.mockResolvedValue({});
  const user = userEvent.setup();
  render(<Supporters />);
  await user.click(screen.getByRole("button", { name: "Invite Supporter" }));
  await user.type(screen.getByLabelText("Email Address"), "friend@example.com");
  await user.click(screen.getByRole("button", { name: "Send Invite" }));
  await waitFor(() =>
    expect(invite.mutateAsync).toHaveBeenCalledWith({ email: "friend@example.com" })
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
it("does not display stale relationship content while loading", () => {
  state.isLoading = true;
  render(<Supporters />);
  expect(screen.queryByText("Community Circle")).not.toBeInTheDocument();
});
