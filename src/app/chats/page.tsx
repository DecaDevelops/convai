import { getChats } from "@/features/chat/chat-action";
import Client from "./client";
import { Metadata } from "next";
export const metdata: Metadata = {
  title: "Search your chats",
};
export default async function Page() {
  const chats = await getChats();
  return <Client chats={chats} />;
}
