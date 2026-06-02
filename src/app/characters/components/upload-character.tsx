"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Import, Upload } from "lucide-react";
import React, { ChangeEvent, memo, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useCharacterMutations } from "../../../features/character/use-character-mutations";
import MarkdownReact from "@/components/MarkdownReact";
import { Badge } from "@/components/ui/badge";
import { CharacterFactory } from "@/features/character/character-factory";
import {
  CharacterImport,
  characterSelect,
} from "@/features/character/character-type";
const CharacterUploadCard: React.FC<{
  character: CharacterImport;
}> = memo(({ character }) => {
  const image = useMemo(() => {
    const _ = character.image?.[0] ?? null;
    if (!_) return "/images/upload.png";

    return URL.createObjectURL(_);
  }, [character.image]);
  return (
    <div className="w-full">
      <Badge className="mb-3">
        Import Id: <span className="font-bold">{character.id}</span>
      </Badge>
      <div className="w-fit mx-auto">
        <Image src={image} alt="" width={64} height={64} />
      </div>
      <h1 className="text-center">{character.name}</h1>
      <p>{character.description}</p>
      <div className="flex flex-col my-2 gap-2">
        <h1>Greeting</h1>
        <div>
          <MarkdownReact content={character.greeting} />
        </div>
        <h1>Personality</h1>
        <div>
          <MarkdownReact content={character.personality} />
        </div>
      </div>
    </div>
  );
});

CharacterUploadCard.displayName = "CharacterUploadCard";

export default function UploadCharacter() {
  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<CharacterImport[]>([]);
  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return toast.error("No file has been uploaded");
    if (file.type !== "application/json")
      return toast.error("File must be of json type");

    const json_file = await file.text();

    const data = JSON.parse(json_file) as characterSelect | characterSelect[];
    if (!Array.isArray(data)) {
      setCharacters([CharacterFactory.CreateImport(data)]);
    } else {
      setCharacters(data.map((x) => CharacterFactory.CreateImport(x)));
    }
    setOpen(true);
  };

  const { doImportCharacterAsync } = useCharacterMutations();
  const onConfirmImport = async () => {
    try {
      await doImportCharacterAsync(characters);
      setOpen(false);
      setCharacters([]);
    } catch {}
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Characters</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            These are the characters you are about to import, make sure to check
            each one
          </DialogDescription>
          <div className="h-96 overflow-y-scroll">
            {characters.map((x) => (
              <CharacterUploadCard character={x} key={x.id} />
            ))}
          </div>
          <DialogFooter>
            <Button onClick={onConfirmImport}>
              <Import />
              Import Characters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full px-5">
        <div className="ml-auto w-fit">
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
            <Label>
              <Upload /> <span>Import character from JSON</span>
              <input
                hidden
                type="file"
                accept="application/json"
                onChange={onUpload}
              />
            </Label>
          </Button>
        </div>
      </div>
    </>
  );
}
