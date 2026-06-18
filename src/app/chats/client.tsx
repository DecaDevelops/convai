"use client";
import { getChatsWithChatbotAndPersona } from "@/features/chat/chat-action";
import ChatCard from "@/features/chat/chat-card";
import {
  ChatSelect,
  ChatWithCharacterAndPersona,
} from "@/features/chat/chat-types";
import { useChatMutations } from "@/features/chat/use-chat-mutation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Client() {
  const {
    data: chats = [],
    isPending,
    isLoading,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getChatsWithChatbotAndPersona,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { doDeleteChat } = useChatMutations();
  const isMounting = isPending || isLoading;

  if (isMounting) return "Loading, please wait";

  return (
    <div className="my-5 mx-5">
      <div className="space-y-5">
        {chats.map((x) => (
          <ChatCard
            key={x.Chat}
            chat={x}
            onDelete={() => doDeleteChat(x.Chat)}
          />
        ))}
      </div>
    </div>
  );
}
