"use client";
import MarkdownReact from "@/components/MarkdownReact";
import PopoverImage from "@/components/PopoverImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useChatMessages from "@/features/chat-message/context";
import useChat from "@/features/chat/chat-context";
import useChattingMutations from "@/features/chatting/use-chatting-mutations";
import { LoaderPinwheel } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatBodyCard from "./ChatBodyCard";
import { Role } from "@/features/chat-message/enum";

export default function ChatBody() {
  const { character } = useChat();
  const { ChatMessages } = useChatMessages();
  const { isPending } = useChattingMutations();
  const [messageToEdit, setMessageToEdit] = useState<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const lastMessage = useMemo(() => {
    return ChatMessages.at(-1);
  }, [ChatMessages]);
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
        <ChatBodyCard
          isLastAssistantMessage={
            x.id === lastMessage?.id && x.role === Role.Assistant
          }
          isSelectedEdit={messageToEdit === x.id}
          setSelectedEdit={setMessageToEdit}
          message={x}
          key={x.id}
        />
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
