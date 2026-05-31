"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "./action";
import { ChatMessageSelect } from "./types";
import { Role } from "./enum";
import { asc } from "drizzle-orm";
import { toast } from "sonner";

export default function useChatMessageMutations() {
  const queryClient = useQueryClient();
  const { mutate: doSendMessage, isPending: isPendingSendMessage } =
    useMutation({
      mutationFn: sendMessage,
      onMutate: async ({ chatId, content }, ctx) => {
        const chat_history = queryClient.getQueryData<ChatMessageSelect[]>([
          "chat_messages",
          chatId,
        ]);
        if (!chat_history) throw new Error("conversation does not exist");
        await queryClient.cancelQueries({
          queryKey: ["chat_messages", chatId],
        });

        queryClient.setQueryData<ChatMessageSelect[]>(
          ["chat_messages", chatId],
          (old) => {
            if (!old) return old;

            return [
              ...old,
              {
                id: Number.MAX_SAFE_INTEGER,
                role: Role.User,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
                chatId,
              },
            ];
          },
        );

        return { chat_history };
      },
      onSuccess: async (data, { chatId }, { chat_history }) => {
        await queryClient.cancelQueries({
          queryKey: ["chat_messages", chatId],
        });

        queryClient.setQueryData<ChatMessageSelect[]>(
          ["chat_messages", chatId],
          (old) => {
            if (!old) return old;

            return [...chat_history, ...data];
          },
        );
      },
      onError: async (err, { chatId }, ctx) => {
        if (!ctx) return toast.error(err.message);

        const { chat_history } = ctx;
        await queryClient.cancelQueries({
          queryKey: ["chat_messages", chatId],
        });

        queryClient.setQueryData<ChatMessageSelect[]>(
          ["chat_messages", chatId],
          (old) => {
            if (!old) return old;
            return chat_history;
          },
        );

        return toast.error(err.message);
      },
    });

  const isPending = isPendingSendMessage;

  return {
    doSendMessage,
    isPending,
  };
}
