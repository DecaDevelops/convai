"use client";

import { useMemo, useState } from "react";
import { PersonaRequest } from "./persona-types";
import { FormDataConverter } from "@/lib/form-data";
import { InputWithLabel } from "@/components/input-with-label";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

type props = {
  onSendForm: (req: FormData) => void;
  isPending: boolean;
  _persona?: PersonaRequest;
};

const EMPTY_REQUEST: PersonaRequest = {
  name: "",
  description: "",
  uploads: null,
};

export default function PersonaForm({
  isPending,
  onSendForm,
  _persona,
}: props) {
  const [persona, setPersona] = useState(_persona ?? EMPTY_REQUEST);

  const image = useMemo(() => {
    if (!persona.uploads) return "/images/upload.png";

    return URL.createObjectURL(persona.uploads);
  }, [persona.uploads]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Persona</CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isPending) return;
          const formData = FormDataConverter.toFormData(persona);
          return onSendForm(formData);
        }}
      >
        <CardContent className="py-3 space-y-5">
          <div className="flex flex-col space-y-2">
            <div className="relative w-64 h-64 mx-auto">
              <Image src={image} fill alt="" style={{ objectFit: "contain" }} />
            </div>
            <Button
              type="button"
              asChild
              className="w-fit mx-auto bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Label>
                <Upload /> <span>Upload Image</span>
                <input
                  hidden
                  type="file"
                  onChange={(e) => {
                    const files = e.currentTarget.files;
                    setPersona((p) => ({ ...p, uploads: files?.[0] ?? null }));
                  }}
                />
              </Label>
            </Button>
          </div>
          <InputWithLabel
            label="Name"
            onChange={(e) =>
              setPersona((p) => ({ ...p, name: e.target.value }))
            }
            value={persona.name}
          />
          <TextAreaWithLabel
            label="Description"
            className="resize-none min-h-32 max-h-96"
            onChange={(e) =>
              setPersona((p) => ({ ...p, description: e.target.value }))
            }
            value={persona.description ?? ""}
          />
        </CardContent>
        <CardFooter>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer ml-auto">
            <Plus /> <span>Create Persona</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
