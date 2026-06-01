"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createModel, deleteModel } from "./model-action";
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

  const { mutate: doDelete, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      toast.success("Model has been deleted");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const isPending = isPendingCreate || isPendingDelete;

  return {
    doCreateModelAsync,
    doDelete,
    isPending,
  };
}
