"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivePersona } from "../chatting/chatting-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNewChat } from "./chat-action";

export function useChatMutations() {
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const invalidateQuery = (msg?: string) => {
    if (msg) toast.success(msg);

    // queryClient.invalidateQueries({ queryKey: ["chats"] });
  };
  const { mutate: doCreateChat } = useMutation({
    mutationFn: createNewChat,
    onSuccess: (data) => {
      toast.success(`chat has been created, redirecting`);
      push(`/chats/${data}`);
    },
    onError: (err) => toast.error(err.message),
  });

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
    doCreateChat,
    isPending,
  };
}
