"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PersonaMapper } from "@/features/persona/persona-mapper";
import { PersonaImport, PersonaSelect } from "@/features/persona/persona-types";
import { usePersonaMutations } from "@/features/persona/use-persona-mutations";
import { Import } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, memo, useState } from "react";
const ImportedPersonaCard: React.FC<{
  persona: PersonaImport;
}> = memo(({ persona }) => {
  const image = persona.image
    ? URL.createObjectURL(persona?.image)
    : "/images/upload.png";
  return (
    <div className="w-full">
      <Badge>
        Import Id: <span className="font-bold">{persona.id}</span>
      </Badge>
      <div className="w-fit mx-auto">
        <Image src={image} width={64} height={64} alt={persona.name} />
      </div>
      <div className="text-center text-xl">{persona.name}</div>
      <p>{persona.description}</p>
    </div>
  );
});

ImportedPersonaCard.displayName = "ImportedPersonaCard";
export default function UploadPersona() {
  const { doImportPersonaAsync } = usePersonaMutations();
  const [personas, setPersonas] = useState<PersonaImport[]>([]);
  const [open, setOpen] = useState(false);
  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    if (file.type !== "application/json") return;

    const json_file = await file.text();
    const data = JSON.parse(json_file) as PersonaSelect | PersonaSelect[];
    if (!Array.isArray(data)) {
      setPersonas([PersonaMapper.mapToImport(data)]);
    } else {
      setPersonas(data.map((x) => PersonaMapper.mapToImport(x)));
    }

    setOpen(true);
  };

  const onPersonaImport = async () => {
    try {
      await doImportPersonaAsync(personas);
      setOpen(false);
      setPersonas([]);
    } catch {}
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import personas</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You are about to import the following personas
          </DialogDescription>
          <div className="h-96 overflow-y-scroll">
            {personas.map((x) => (
              <ImportedPersonaCard persona={x} key={x.id} />
            ))}
          </div>
          <DialogFooter>
            <Button onClick={onPersonaImport}>
              <Import /> <span>Import Personas</span>
            </Button>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full">
        <div className="w-fit">
          <Button asChild>
            <Label>
              <Import /> <span>Import Persona</span>
              <input
                type="file"
                accept="application/json"
                onChange={onUpload}
                hidden
              />
            </Label>
          </Button>
        </div>
      </div>
    </>
  );
}
