import { ChatMessageProvider } from "@/features/chat-message/context";

import { ChatContextProvider } from "@/features/chat/chat-context";
import React from "react";
import Client from "./client";
import { getChat } from "@/features/chat/chat-action";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chat = await getChat(id);
  if (!chat) return "not found";

  return (
    <ChatContextProvider Chat={chat}>
      <ChatMessageProvider ChatId={id}>
        <Client />
      </ChatMessageProvider>
    </ChatContextProvider>
  );
}
