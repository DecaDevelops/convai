"use client";

import PopoverImage from "@/components/PopoverImage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useChat from "@/features/chat/context";
import { EllipsisVertical, VenetianMask } from "lucide-react";
import { useEffect } from "react";
const ChatHeaderDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"icon-xs"}
          className="mt-auto ml-auto cursor-pointer"
          variant={"ghost"}
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="end">
        <DropdownMenuItem className="w-full">
          <VenetianMask /> <span>Change Persona</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function ChatHeader() {
  const { character } = useChat();
  useEffect(() => {
    console.log(character);
  }, [character]);
  const image = character
    ? (character.image?.[0] ?? "/images/upload.png")
    : "/images/upload.png";
  console.log(image);
  return (
    <div className="flex flex-row justify-between w-full bg-slate-900 p-2">
      <div className="flex flex-row">
        <PopoverImage url={image} height={72} width={72} />
        <span className="text-xl">{character?.name}</span>
      </div>
      <ChatHeaderDropdown />
    </div>
  );
}
