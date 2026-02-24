import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/lib/local-storage-adapter";

export function useSupporters() {
  return useQuery({
    queryKey: ["/api/supporters"],
    queryFn: () => storage.getSupporters(),
  });
}

export function useInviteSupporter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string }) => {
      return Promise.resolve(storage.inviteSupporter(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supporters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });
}

export function useUpdateSupporterStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "accepted" | "rejected" }) => {
      return Promise.resolve(storage.updateSupporterStatus(id, status));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supporters"] });
    },
  });
}
