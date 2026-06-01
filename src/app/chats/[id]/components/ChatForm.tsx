"use client";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import { Button } from "@/components/ui/button";
import useChattingMutations from "@/features/chatting/use-chatting-mutations";
import { Loader2, Send } from "lucide-react";
import { useParams } from "next/navigation";
import React, { SyntheticEvent, useRef, useState } from "react";

export default function ChatForm() {
  const { id } = useParams<{ id: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const { doSendMessageAsync, isPending } = useChattingMutations();
  const [message, setMessage] = useState("");
  const onSendMessage = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    const content = message.trim();
    try {
      setMessage("");
      await doSendMessageAsync({ chatId: id, content });
    } catch {
      setMessage(content);
    }
  };

  return (
    <form onSubmit={onSendMessage} ref={formRef}>
      <div className="flex flex-row items-start gap-2">
        <TextAreaWithLabel
          className="max-h-32 resize-none"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.stopPropagation();
              formRef.current?.requestSubmit();
              return;
            }
          }}
        />
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          {isPending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </form>
  );
}
