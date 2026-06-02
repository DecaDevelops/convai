"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag, deleteTag, updateTag } from "./tag-action";
import { toast } from "sonner";

export default function useTagMutations() {
  const queryClient = useQueryClient();
  const invalidateQuery = () =>
    queryClient.invalidateQueries({ queryKey: ["tags"] });

  const {
    mutateAsync: doCreateTagAsync,
    mutate: doCreateTag,
    isPending: isPendingCreate,
  } = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast.success("Tag has been created");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const {
    mutate: doUpdateTag,
    mutateAsync: doUpdateTagAsync,
    isPending: isPendingUpdate,
  } = useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      toast.success("Tag has been updated");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const {
    mutate: doDeleteTag,
    mutateAsync: doDeleteTagAsync,
    isPending: isPendingDelete,
  } = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      toast.success("Tag has been deleted");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });

  const isPending = isPendingCreate || isPendingDelete || isPendingUpdate;

  return {
    doCreateTag,
    doCreateTagAsync,
    doDeleteTag,
    doDeleteTagAsync,
    doUpdateTag,
    doUpdateTagAsync,
    isPending,
  };
}
