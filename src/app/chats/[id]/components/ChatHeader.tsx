"use client";

import PopoverImage from "@/components/PopoverImage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useChat from "@/features/chat/chat-context";
import { useChatMutations } from "@/features/chat/use-chat-mutation";
import {
  EllipsisVertical,
  MessageCirclePlus,
  VenetianMask,
} from "lucide-react";
import { useEffect, useState } from "react";
import PersonaSelectSheet from "./PersonaSelect";
const ChatHeaderDropdown: React.FC<{
  onOpenPersona: VoidFunction;
}> = ({ onOpenPersona }) => {
  const { doCreateChat } = useChatMutations();
  const { character } = useChat();
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
        <DropdownMenuItem
          onClick={() => doCreateChat({ characterId: character?.id })}
        >
          <MessageCirclePlus /> <span>Create new chat</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenPersona}>
          <VenetianMask /> <span>Change Persona</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function ChatHeader() {
  const { character } = useChat();
  const [openPersona, setOpenPersona] = useState(false);
  useEffect(() => {
    console.log(character);
  }, [character]);
  const image = character
    ? (character.image?.[0] ?? "/images/upload.png")
    : "/images/upload.png";
  console.log(image);
  return (
    <>
      <PersonaSelectSheet open={openPersona} setOpen={setOpenPersona} />
      <div className="flex flex-row justify-between w-full bg-slate-900 p-2">
        <div className="flex flex-row">
          <PopoverImage url={image} height={72} width={72} />
          <span className="text-xl">{character?.name}</span>
        </div>
        <ChatHeaderDropdown onOpenPersona={() => setOpenPersona(true)} />
      </div>
    </>
  );
}
