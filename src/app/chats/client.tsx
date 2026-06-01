"use client";
import { ChatSelect } from "@/features/chat/chat-types";
import Link from "next/link";
import React from "react";

type props = {
  chats: ChatSelect[];
};
export default function Client({ chats }: props) {
  return (
    <div>
      {chats.map((x) => (
        <span key={x.id}>
          <Link href={`/chats/${x.id}`}>continue chat {x.id}</Link>
        </span>
      ))}
    </div>
  );
}
