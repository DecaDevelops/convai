"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { memo } from "react";
import { characterSelect } from "./type";
import Image from "next/image";
import { EllipsisVertical, MessageCirclePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCharacterMutations } from "./mutations";
type props = {
  character: characterSelect;
  onDelete: VoidFunction;
  startChat: VoidFunction;
  startNewChat: VoidFunction;
  isFavorite: boolean;
  favorite: VoidFunction;
};
function CharacterCard({
  character,
  favorite,
  isFavorite,
  onDelete,
  startChat,
  startNewChat,
}: props) {
  const image = character.image?.[0] ?? "/images/upload.png";
  const { doDeleteCharacter } = useCharacterMutations();
  return (
    <>
      <Card className="w-xs">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {character.name}
          </CardTitle>
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={image}
              fill
              unoptimized
              loading="eager"
              style={{ objectFit: "cover" }}
              alt={character.name}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-4 text-center">
            {character.description}
          </CardDescription>
          <div className="flex flex-col py-2 gap-2">
            <Button
              className="mx-auto cursor-pointer"
              variant={"outline"}
              onClick={startChat}
            >
              <MessageCirclePlus /> <span>Start/Continue chat</span>
            </Button>
            <Button
              className="mx-auto"
              onClick={startNewChat}
              variant={"outline"}
            >
              <MessageCirclePlus /> <span>Create new chat</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto" size={"sm"} variant={"ghost"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem onClick={() => doDeleteCharacter(character.id)}>
                <Trash2 /> <span>Delete Character</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </>
  );
}

export default memo(CharacterCard);
