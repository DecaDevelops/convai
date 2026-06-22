"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { continueMessage, sendMessage, updateMessage } from "./chatting-action";
import { ChatMessageSelect } from "../chat-message/types";
import { toast } from "sonner";
import { Role } from "../chat-message/enum";
import { useParams, usePathname } from "next/navigation";

export default function useChattingMutations() {
  const { id } = useParams<{ id: string }>();
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
        id,
      ]);
      if (!chat_history) throw new Error("conversation does not exist");
      await queryClient.cancelQueries({
        queryKey: ["chat_messages", id],
      });

      queryClient.setQueryData<ChatMessageSelect[]>(
        ["chat_messages", id],
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
              chatId: id,
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
        ["chat_messages", id],
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
        queryKey: ["chat_messages", id],
      });

      queryClient.setQueryData<ChatMessageSelect[]>(
        ["chat_messages", id],
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

  const { mutateAsync: doUpdateMessageAsync, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: ({
        message,
        messageId,
      }: {
        message: string;
        messageId: number;
      }) =>
        updateMessage({ ChatId: id, Message: message, MessageId: messageId }),
      onSuccess: async (value, variables) => {
        await queryClient.cancelQueries({ queryKey: ["chat_messages", id] });

        await queryClient.setQueryData(
          ["chat_messages", id],
          (old: ChatMessageSelect[]) => {
            if (!old) return old;

            return old.map((x) => {
              if (x.id !== variables.messageId) return x;

              return { ...x, content: variables.message };
            });
          },
        );
        toast.success("Message has been updated");
      },
      onError: (err) => toast.error(err.message),
    });

  const isPending = isPendingSendMessage || isPendingContinue;
  return {
    doContinueMessage,
    doSendMessage,
    doSendMessageAsync,
    doUpdateMessageAsync,
    isPending,
    isPendingUpdate,
  };
}
