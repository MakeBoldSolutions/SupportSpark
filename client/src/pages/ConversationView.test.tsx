import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Conversation } from "@shared/schema";
import ConversationView from "./ConversationView";
const state = vi.hoisted(() => ({
  data: undefined as Conversation | undefined,
  isLoading: false,
  error: null as Error | null,
}));
const auth = vi.hoisted(() => ({
  user: { id: "owner", firstName: "Jane" },
  logoutMutation: { mutate: vi.fn() },
}));
const mutation = vi.hoisted(() => ({ mutateAsync: vi.fn(), isPending: false }));
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => auth }));
vi.mock("@/hooks/use-conversations", () => ({
  useConversation: () => state,
  useAddMessage: () => mutation,
}));
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  window.history.replaceState({}, "", "/conversation/1");
  state.data = {
    id: 1,
    memberId: "owner",
    title: "Journey",
    memberName: "Jane",
    createdAt: "2026-09-21",
    data: {
      messages: [
        {
          id: "first",
          authorId: "owner",
          authorName: "Jane",
          timestamp: "2026-09-21",
          content: "Initial update",
          images: ["/first.png"],
        },
      ],
    },
  };
  state.isLoading = false;
  state.error = null;
  auth.user.id = "owner";
  mutation.isPending = false;
  mutation.mutateAsync.mockResolvedValue({});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  window.history.replaceState({}, "", "/");
});
it("renders loading and missing conversations", () => {
  state.isLoading = true;
  const view = render(<ConversationView />);
  expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  state.isLoading = false;
  state.data = undefined;
  view.rerender(<ConversationView />);
  expect(screen.getByText("Update not found")).toBeInTheDocument();
});
it("renders messages in order and submits a reply", async () => {
  state.data!.data.messages.push({
    id: "second",
    authorId: "friend",
    authorName: "Alex",
    timestamp: "2026-09-22",
    content: "Encouragement",
    images: ["/reply.png"],
  });
  render(<ConversationView />);
  expect(screen.getByText("Initial update")).toBeInTheDocument();
  expect(screen.getByText("Encouragement")).toBeInTheDocument();
  expect(screen.getByAltText("Reply image 1")).toHaveAttribute("src", "/reply.png");
  expect(screen.getByTestId("button-send-message")).toBeDisabled();
  await userEvent.type(screen.getByTestId("input-reply-content"), "Thank you");
  await userEvent.click(screen.getByTestId("button-send-message"));
  await waitFor(() =>
    expect(mutation.mutateAsync).toHaveBeenCalledWith({ content: "Thank you", images: undefined })
  );
  expect(screen.getByTestId("input-reply-content")).toHaveValue("");
});
it("supports formatting, image attachments and removal", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ images: ["/uploaded.png"] }) });
  vi.stubGlobal("fetch", fetchMock);
  render(<ConversationView />);
  expect(screen.getByText(/No replies yet/)).toBeInTheDocument();
  for (const button of ["bold", "italic", "link"])
    await userEvent.click(screen.getByTestId(`button-${button}`));
  expect(screen.getByTestId("input-reply-content")).not.toHaveValue("");
  await userEvent.click(screen.getByTestId("button-add-image"));
  await userEvent.upload(
    screen.getByTestId("input-image-upload"),
    new File(["image"], "image.png", { type: "image/png" })
  );
  expect(await screen.findByAltText("Upload 1")).toBeInTheDocument();
  await userEvent.click(screen.getByTestId("button-remove-image-0"));
  expect(screen.queryByAltText("Upload 1")).not.toBeInTheDocument();
  await userEvent.upload(
    screen.getByTestId("input-image-upload"),
    new File(["image"], "image.png", { type: "image/png" })
  );
  await screen.findByAltText("Upload 1");
  await userEvent.click(screen.getByTestId("button-send-message"));
  await waitFor(() =>
    expect(mutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ images: ["/uploaded.png"] })
    )
  );
});
it("recovers from failed uploads and hides upload controls from supporters", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  const view = render(<ConversationView />);
  fireEvent.change(screen.getByTestId("input-image-upload"), { target: { files: [] } });
  await userEvent.upload(
    screen.getByTestId("input-image-upload"),
    new File(["image"], "image.png", { type: "image/png" })
  );
  await waitFor(() => expect(screen.getByTestId("button-add-image")).not.toBeDisabled());
  expect(screen.queryByAltText("Upload 1")).not.toBeInTheDocument();
  auth.user.id = "supporter";
  view.rerender(<ConversationView />);
  expect(screen.queryByTestId("button-add-image")).not.toBeInTheDocument();
});
