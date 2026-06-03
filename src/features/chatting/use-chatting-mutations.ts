"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { continueMessage, sendMessage } from "./chatting-action";
import { ChatMessageSelect } from "../chat-message/types";
import { toast } from "sonner";
import { Role } from "../chat-message/enum";

export default function useChattingMutations() {
  const queryClient = useQueryClient();

  const {
    mutate: doSendMessage,
    mutateAsync: doSendMessageAsync,
    isPending: isPendingSendMessage,
  } = useMutation({
    mutationFn: sendMessage,
    onMutate: async ({ chatId, content }) => {
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

  const { mutate: doContinueMessage, isPending: isPendingContinue } =
    useMutation({
      mutationFn: continueMessage,
      onSuccess: async (chatMessage, chatId) => {
        await queryClient.cancelQueries({
          queryKey: ["chat_messages", chatId],
        });
        queryClient.setQueryData<ChatMessageSelect[]>(
          ["chat_messages", chatId],
          (old) => {
            if (!old) return old;

            return [...old, chatMessage];
          },
        );
      },
    });

  const isPending = isPendingSendMessage || isPendingContinue;
  return {
    doContinueMessage,
    doSendMessage,
    doSendMessageAsync,
    isPending,
  };
}
