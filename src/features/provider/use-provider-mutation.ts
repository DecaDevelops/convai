"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProvider, deleteProvider } from "./provider-action";
import { toast } from "sonner";

export default function useProviderMutations() {
  const queryClient = useQueryClient();
  const invalidateQuery = () =>
    queryClient.invalidateQueries({ queryKey: ["providers"] });

  const { mutateAsync: doCreateProviderAsync, isPending: isCreating } =
    useMutation({
      mutationFn: createProvider,
      onSuccess: () => {
        toast.success("Provider has been created");
        invalidateQuery();
      },
      onError: (err) => toast.error(err.message),
    });

  const { mutate: doDeleteProvider, isPending: isDeleting } = useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      toast.success("Provider has been deleted");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const isPending = isCreating || isDeleting;

  return {
    doCreateProviderAsync,
    doDeleteProvider,
    isPending,
  };
}
