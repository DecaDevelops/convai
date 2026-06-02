"use client";
import MarkdownReact from "@/components/MarkdownReact";
import PopoverImage from "@/components/PopoverImage";
import { Button } from "@/components/ui/button";
import { characterSelect } from "@/features/character/character-type";
import { useChatMutations } from "@/features/chat/use-chat-mutation";
import { MessageCircle } from "lucide-react";
import React from "react";

export default function Client({ character }: { character: characterSelect }) {
  const image = character.image?.[0] ?? "/images/upload.png";
  const { doCreateChat } = useChatMutations();
  return (
    <div className="w-1/2 mx-auto space-y-4 py-5">
      <div className="flex flex-row flex-1">
        <div>
          <PopoverImage url={image} height={192} width={192} />
        </div>
        <div className="flex flex-col items-center w-full">
          <h1 className="text-2xl text-center">{character.name}</h1>
          <p>{character.description}</p>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white mt-auto cursor-pointer"
            onClick={() => doCreateChat({ characterId: character.id })}
          >
            <MessageCircle /> <span>Start Chat</span>
          </Button>
        </div>
      </div>
      <div>
        <h1 className="text-2xl">Greeting</h1>
        <div className="bg-slate-800 p-2">
          <MarkdownReact content={character.greeting} />
        </div>
      </div>
      <div>
        <h1 className="text-2xl">Personality</h1>
        <div className="bg-slate-800 p-4">
          <MarkdownReact content={character.personality} />
        </div>
      </div>
    </div>
  );
}
