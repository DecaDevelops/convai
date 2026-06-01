"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useChat from "@/features/chat/chat-context";
import usePersonas from "@/features/persona/persona-context";
import { PersonaSelect } from "@/features/persona/persona-types";
import Image from "next/image";
import React, { Dispatch, memo, SetStateAction } from "react";

const PersonaCard: React.FC<{
  persona: PersonaSelect;
  onSelect: VoidFunction;
  isSelected: boolean;
}> = memo(({ onSelect, isSelected, persona }) => {
  const image = persona.image ?? "/images/upload.png";
  return (
    <Card className="cursor-pointer" onClick={onSelect}>
      <CardHeader className="flex flex-row items-start gap-2">
        <Image src={image} alt="" width={96} height={96} />
        <CardTitle className="text-xl">{persona.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{persona.description}</CardDescription>
      </CardContent>
      {isSelected && (
        <CardFooter>
          <Badge className="ml-auto">Selected</Badge>
        </CardFooter>
      )}
    </Card>
  );
});

PersonaCard.displayName = "PersonaCard";

export default function PersonaSelectSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { personas } = usePersonas();
  const { activePersona, setActivePersona } = useChat();
  const id = activePersona?.id ?? null;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="w-[50vw] mx-auto min-h-[90vh]">
        <SheetHeader>
          <SheetTitle>Change Persona</SheetTitle>
        </SheetHeader>
        <SheetDescription className="p-2">
          Change active Persona
        </SheetDescription>
        <div className="flex flex-col">
          {personas.map((x) => (
            <PersonaCard
              isSelected={x.id === id}
              onSelect={() => setActivePersona(x.id)}
              persona={x}
              key={x.id}
            />
          ))}
        </div>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
