"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProvider,
  deleteProvider,
  updateProvider,
} from "./provider-action";
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

  const {
    mutate: doDeleteProvider,
    mutateAsync: doDeleteProviderAsync,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      toast.success("Provider has been deleted");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutateAsync: doUpdateProviderAsync, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: updateProvider,
      onSuccess: () => {
        toast.success("Provider has been updated");
        invalidateQuery();
      },
      onError: (err) => toast.error(err.message),
    });
  const isPending = isCreating || isDeleting || isPendingUpdate;

  return {
    doCreateProviderAsync,
    doDeleteProvider,
    doDeleteProviderAsync,
    doUpdateProviderAsync,
    isPending,
  };
}
