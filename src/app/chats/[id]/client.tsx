"use client";
import React, { SyntheticEvent, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import { Button } from "@/components/ui/button";
import { ChatMessageSelect } from "@/features/chat-message/types";
import useChat from "@/features/chat/context";
import { useParams } from "next/navigation";
import { sendMessage } from "@/features/chat-message/action";
import ChatBody from "./components/ChatBody";
import useChatMessageMutations from "@/features/chat-message/mutations";

export default function Client() {
  const { id } = useParams<{ id: string }>();
  const { doSendMessage, isPending } = useChatMessageMutations();
  const [message, setMessage] = useState("");
  const onSendMessage = async (e: SyntheticEvent<HTMLFormElement>) => {
    if (isPending) return;
    e.preventDefault();
    doSendMessage({ chatId: id, content: message });
  };
  return (
    <div className="h-screen flex flex-col justify-between">
      <ChatHeader />
      <div className="h-3/4 overflow-y-scroll mx-5 my-2">
        <ChatBody />
      </div>
      <div className="mt-auto">
        <form onSubmit={onSendMessage}>
          <TextAreaWithLabel
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
