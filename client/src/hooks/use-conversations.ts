import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/lib/local-storage-adapter";

// Fetch all conversations (for dashboard/timeline)
export function useConversations() {
  return useQuery({
    queryKey: ["/api/conversations"],
    queryFn: () => storage.getConversations(),
  });
}

// Fetch single conversation by ID
export function useConversation(id: number) {
  return useQuery({
    queryKey: ["/api/conversations", id],
    queryFn: () => storage.getConversation(id),
    enabled: !!id,
  });
}

// Create a new conversation (Update)
export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; initialMessage: string }) => {
      return Promise.resolve(storage.createConversation(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });
}

// Add message/reply to conversation
export function useAddMessage(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; parentMessageId?: string; images?: string[] }) => {
      return Promise.resolve(storage.addMessage(conversationId, data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });
}
