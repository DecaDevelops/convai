"use client";
import { createContext, PropsWithChildren, useContext } from "react";
import { ChatMessageSelect } from "./types";
import { useQuery } from "@tanstack/react-query";
import { getChatMessages } from "./action";

type ChatMessageActionState = {
  ChatMessages: ChatMessageSelect[];
  isPending: boolean;
};

type props = {
  ChatId: string;
} & PropsWithChildren;

const ChatMessageContext = createContext<ChatMessageActionState | undefined>(
  undefined,
);

export function ChatMessageProvider({ ChatId, children }: props) {
  const {
    data: ChatMessages = [],
    isPending: isPendingMessages,
    isLoading: isLoadingMessages,
  } = useQuery({
    queryKey: ["chat_messages", ChatId],
    queryFn: () => getChatMessages(ChatId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const isPending = isPendingMessages || isLoadingMessages;
  return (
    <ChatMessageContext.Provider value={{ ChatMessages, isPending }}>
      {children}
    </ChatMessageContext.Provider>
  );
}

export default function useChatMessages() {
  const ctx = useContext(ChatMessageContext);
  if (!ctx)
    throw new Error(
      "useChatMessages must be used within a ChatMessageProvider",
    );

  return ctx;
}
