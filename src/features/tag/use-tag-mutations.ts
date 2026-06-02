"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag } from "./tag-action";
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
  const isPending = isPendingCreate;
  return {
    doCreateTag,
    doCreateTagAsync,
    isPending,
  };
}
