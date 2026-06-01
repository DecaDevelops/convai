"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiKey, deleteApiKey } from "./api-keys-action";
import { toast } from "sonner";

export default function useApiKeysMutations() {
  const queryClient = useQueryClient();

  const invalidateQuery = () =>
    queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
  const {
    mutateAsync: doCreateApiKeyAsync,
    mutate: doCreateApiKey,
    isPending: isPendingCreate,
  } = useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      toast.success("Api key has been created");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: doDeleteApiKey, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      toast.success("Api key has been removed");
      invalidateQuery();
    },
  });

  const isPending = isPendingCreate || isPendingDelete;
  return {
    doCreateApiKey,
    doCreateApiKeyAsync,
    doDeleteApiKey,
    isPending,
  };
}
