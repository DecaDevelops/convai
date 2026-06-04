"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiKey, deleteApiKey, updateApiKey } from "./api-keys-action";
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

  const {
    mutate: doDeleteApiKey,
    mutateAsync: doDeleteApiKeyAsync,
    isPending: isPendingDelete,
  } = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      toast.success("Api key has been removed");
      invalidateQuery();
    },
  });

  const { mutateAsync: doUpdateApiKeyAsync, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: updateApiKey,
      onSuccess: () => {
        toast.success("Api key has been updated");
        invalidateQuery();
      },
      onError: (err) => toast.error(err.message),
    });

  const isPending = isPendingCreate || isPendingDelete || isPendingUpdate;
  return {
    doCreateApiKey,
    doCreateApiKeyAsync,
    doDeleteApiKey,
    doDeleteApiKeyAsync,
    doUpdateApiKeyAsync,
    isPending,
  };
}
