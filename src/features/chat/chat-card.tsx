import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChatWithCharacterAndPersona } from "./chat-types";
import useCharacters from "../character/character-context";
import usePersonas from "../persona/persona-context";
import Link from "next/link";
import { memo } from "react";
import MarkdownReact from "@/components/MarkdownReact";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash2 } from "lucide-react";

function ChatCard({
  chat,
  onDelete,
}: {
  chat: ChatWithCharacterAndPersona;
  onDelete: VoidFunction;
}) {
  const { mappedCharacters } = useCharacters();
  const { mappedPersonas } = usePersonas();
  const character = mappedCharacters.get(chat.Character ?? "") ?? null;
  const characterImage = character?.image?.[0] ?? "/images/upload.png";
  const persona = mappedPersonas.get(chat.Persona ?? "") ?? null;
  const personaImage = persona?.image ?? "/images/upload.png";
  return (
    <Card>
      <Link href={`/chats/${chat.Chat}`}>
        <CardHeader>
          <CardTitle className="text-xl">
            <span>
              {character?.name ?? "Deleted Character"} →{" "}
              {persona?.name ?? "You"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="line-clamp-4">
            <div className="grid grid-cols-2">
              <Image src={characterImage} width={96} height={96} alt="" />
              <Image src={personaImage} width={96} height={96} alt="" />
            </div>
            <MarkdownReact content={chat.Message?.content ?? ""} />
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="ml-auto">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete}>
              <Trash2 /> <span>Delete Chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

export default memo(ChatCard);
