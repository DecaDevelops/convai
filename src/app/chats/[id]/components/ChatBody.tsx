"use client";
import MarkdownReact from "@/components/MarkdownReact";
import PopoverImage from "@/components/PopoverImage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useChatMessages from "@/features/chat-message/context";
import { ChatMessageSelect } from "@/features/chat-message/types";
import useChat from "@/features/chat/chat-context";
import useChattingMutations from "@/features/chatting/use-chatting-mutations";
import { LoaderPinwheel, MessageCirclePlus } from "lucide-react";
import React, { memo, useEffect, useRef } from "react";

const ChatMessageCard: React.FC<{
  message: ChatMessageSelect;
}> = memo(({ message }) => {
  const { activePersona, character, chatId } = useChat();
  const { doContinueMessage, isPending } = useChattingMutations();
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
    <Card className="shrink-0">
      <CardHeader className="flex flex-row items-start">
        <PopoverImage url={image} height={52} width={52} />
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownReact content={content} />
      </CardContent>
      <CardFooter>
        <Button
          variant={"ghost"}
          size={"icon-xs"}
          onClick={() => {
            if (isPending) return;
            doContinueMessage(chatId);
          }}
        >
          <MessageCirclePlus />
        </Button>
      </CardFooter>
    </Card>
  );
});

ChatMessageCard.displayName = "ChatMessageCard";

export default function ChatBody() {
  const { character } = useChat();
  const { ChatMessages } = useChatMessages();
  const { isPending } = useChattingMutations();
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!divRef.current) return;

    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!divRef.current) return;

    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [ChatMessages]);
  return (
    <div className="h-full flex flex-col gap-3 w-1/2 mx-auto">
      {ChatMessages.map((x) => (
        <ChatMessageCard message={x} key={x.id} />
      ))}

      <Card className={`${!isPending && "hidden"} shrink-0`}>
        <CardHeader className="flex flex-row items-start">
          <PopoverImage
            width={52}
            height={52}
            url={character?.image?.[0] ?? "/images/upload.png"}
          />
          <CardTitle>{character?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoaderPinwheel className="animate-spin size-12" />
        </CardContent>
      </Card>
      <div ref={divRef} className="w-full h-1"></div>
    </div>
  );
}
