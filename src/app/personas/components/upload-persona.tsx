"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PersonaSelect } from "@/features/persona/persona-types";
import { Import } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

export default function UploadPersona() {
  const [personas, setPersonas] = useState<PersonaSelect[]>([]);
  const [open, setOpen] = useState(false);
  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    if (file.type !== "application/json") return;

    const json_file = await file.text();
    const data = JSON.parse(json_file) as PersonaSelect | PersonaSelect[];
    if (!Array.isArray(data)) {
      setPersonas([data]);
    } else {
      setPersonas(data);
    }

    setOpen(true);
  };
  return (
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
  );
}
