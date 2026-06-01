"use client";
import React, { SyntheticEvent, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import ChatBody from "./components/ChatBody";
import useChattingMutations from "@/features/chatting/use-chatting-mutations";
import ChatForm from "./components/ChatForm";

export default function Client() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <ChatHeader />
      <div className="h-3/4 overflow-y-scroll mx-5 my-2">
        <ChatBody />
      </div>
      <div className="w-1/2 mx-auto mt-auto">
        <ChatForm />
      </div>
    </div>
  );
}
