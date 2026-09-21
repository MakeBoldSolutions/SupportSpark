import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateUpdateDialog } from "./create-update-dialog";
const mutation = vi.hoisted(() => ({ mutateAsync: vi.fn(), isPending: false }));
const toast = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/use-conversations", () => ({ useCreateConversation: () => mutation }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));
beforeEach(() => { mutation.mutateAsync.mockResolvedValue({ id: 1 }); vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview"); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
async function open() {
  render(<CreateUpdateDialog />);
  await userEvent.click(screen.getByRole("button", { name: "Post Update" }));
}
async function fill() {
  await userEvent.type(screen.getByLabelText("Title"), "Journey");
  await userEvent.type(screen.getByPlaceholderText("Share your journey..."), "News");
}
it("validates and publishes a text update", async () => {
  await open();
  await userEvent.click(screen.getByRole("button", { name: "Publish Update" }));
  expect(await screen.findByText("Title is required")).toBeInTheDocument();
  expect(mutation.mutateAsync).not.toHaveBeenCalled();
  await fill();
  await userEvent.click(screen.getByRole("button", { name: "Publish Update" }));
  await waitFor(() => expect(mutation.mutateAsync).toHaveBeenCalledWith({ title: "Journey", initialMessage: "News" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
it("formats text and uploads only valid selected images", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ images: ["/image.png"] }) }));
  await open(); await fill();
  for (const button of ["bold", "italic", "link", "add-images"]) await userEvent.click(screen.getByTestId(`button-${button}`));
  fireEvent.change(screen.getByTestId("input-image-upload"), { target: { files: [new File(["image"], "image.png", { type: "image/png" }), new File(["html"], "file.html", { type: "text/html" })] } });
  expect(screen.getByAltText("Preview 1")).toBeInTheDocument();
  expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Some files skipped" }));
  await userEvent.click(screen.getByTestId("button-remove-image-0"));
  expect(screen.queryByAltText("Preview 1")).not.toBeInTheDocument();
  await userEvent.upload(screen.getByTestId("input-image-upload"), new File(["image"], "image.png", { type: "image/png" }));
  await userEvent.click(screen.getByRole("button", { name: "Publish Update" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  expect(fetch).toHaveBeenLastCalledWith("/api/conversations/1/messages", expect.objectContaining({ credentials: "include" }));
});
it("preserves the form and reports a publishing failure", async () => {
  mutation.mutateAsync.mockRejectedValueOnce(new Error("offline"));
  await open(); await fill();
  await userEvent.click(screen.getByRole("button", { name: "Publish Update" }));
  await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive" })));
  expect(screen.getByLabelText("Title")).toHaveValue("Journey");
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
