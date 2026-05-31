"use client";
import MarkdownReact from "@/components/MarkdownReact";
import PopoverImage from "@/components/PopoverImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useChatMessages from "@/features/chat-message/context";
import { ChatMessageSelect } from "@/features/chat-message/types";
import useChat from "@/features/chat/context";
import Image from "next/image";
import React, { memo } from "react";

const ChatMessageCard: React.FC<{
  message: ChatMessageSelect;
}> = memo(({ message }) => {
  const { activePersona, character } = useChat();

  const name =
    message.role == 0
      ? (activePersona?.name ?? "You")
      : (character?.name ?? "Assistant");
  const image =
    message.role == 0
      ? (activePersona?.image ?? "/images/upload.png")
      : (character?.image?.[0] ?? "/images/upload.png");

  const content =
    message.content
      ?.replaceAll("{{char}}", character?.name ?? "Assistant")
      .replaceAll("{{user}}", activePersona?.name ?? "You") ?? "";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start">
        <PopoverImage url={image} height={52} width={52} />
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownReact content={content} />
      </CardContent>
    </Card>
  );
});

ChatMessageCard.displayName = "ChatMessageCard";

export default function ChatBody() {
  const { ChatMessages } = useChatMessages();
  return (
    <div className="h-full flex flex-col gap-3">
      {ChatMessages.map((x) => (
        <ChatMessageCard message={x} key={x.id} />
      ))}
    </div>
  );
}
