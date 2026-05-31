import { getChats } from "@/features/chat/action";
import React from "react";
import Client from "./client";

export default async function Page() {
  const chats = await getChats();
  return <Client chats={chats} />;
}
