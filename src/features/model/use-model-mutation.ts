"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createModel, deleteModel, updateModel } from "./model-action";
import { toast } from "sonner";

export default function useModelMutations() {
  const queryClient = useQueryClient();
  const invalidateQuery = () =>
    queryClient.invalidateQueries({ queryKey: ["models"] });

  const { mutateAsync: doCreateModelAsync, isPending: isPendingCreate } =
    useMutation({
      mutationFn: createModel,
      onSuccess: () => {
        toast.success("Model has been registered");
        invalidateQuery();
      },
      onError: (err) => toast.error(err.message),
    });

  const {
    mutate: doDelete,
    mutateAsync: doDeleteAsync,
    isPending: isPendingDelete,
  } = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      toast.success("Model has been deleted");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutateAsync: doUpdateAsync, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: updateModel,
      onSuccess: () => {
        toast.success("Model has been updated");
        invalidateQuery();
      },
      onError: (err) => toast.error(err.message),
    });

  const isPending = isPendingCreate || isPendingDelete || isPendingUpdate;

  return {
    doCreateModelAsync,
    doDelete,
    doDeleteAsync,
    doUpdateAsync,
    isPending,
  };
}
