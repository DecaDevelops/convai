"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { memo, useState } from "react";
import { characterSelect } from "./character-type";
import Image from "next/image";
import {
  EllipsisVertical,
  MessageCirclePlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCharacterMutations } from "./use-character-mutations";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [open, setOpen] = useState(false);
  const { doDeleteCharacterAsync } = useCharacterMutations();
  const onConfirmDelete = async () => {
    try {
      await doDeleteCharacterAsync(character.id);
      setOpen(false);
    } catch {
      //do something on delete
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {character.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this character? This cannot be
            reverted
          </DialogDescription>
          <DialogFooter>
            <Button onClick={onConfirmDelete}>
              <Trash2 /> <span>Delete</span>
            </Button>
            <DialogClose asChild>
              <Button variant={"outline"} className="ml-auto">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-xs">
        <CardHeader>
          <Link href={`/character/${character.id}`}>
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
          </Link>
        </CardHeader>
        <CardContent className="h-32">
          <Link href={`/character/${character.id}`}>
            <CardDescription className="line-clamp-4 text-center">
              {character.description}
            </CardDescription>
          </Link>
        </CardContent>
        <CardFooter className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto" size={"sm"} variant={"ghost"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem asChild>
                <Link href={`/characters/edit/${character.id}`}>
                  <Pencil /> <span>Edit Character</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
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
