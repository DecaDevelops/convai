import {
  getChats,
  getChatsWithChatbotAndPersona,
} from "@/features/chat/chat-action";
import Client from "./client";
import { Metadata } from "next";
export const metdata: Metadata = {
  title: "Search your chats",
};
export default async function Page() {
  // const chats = await getChats();
  // const chatsWithPersonas = await getChatsWithChatbotAndPersona();
  // if (chatsWithPersonas.length === 0) return "No chats found";
  return <Client />;
}
