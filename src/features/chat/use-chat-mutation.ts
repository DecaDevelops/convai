"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivePersona } from "../chatting/action";
import { toast } from "sonner";

export function useChatMutations() {
  const queryClient = useQueryClient();
  const { mutate: doUpdateActivePersona, isPending: isPendingUpdatePersona } =
    useMutation({
      mutationFn: updateActivePersona,
      onSuccess: () => {
        toast.success("persona has been changed");
      },
      onError: (err) => toast.error(err.message),
    });

  const isPending = isPendingUpdatePersona;

  return {
    doUpdateActivePersona,
    isPending,
  };
}
