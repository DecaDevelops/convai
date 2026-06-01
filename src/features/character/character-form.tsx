"use client";
import React, { useMemo, useState } from "react";
import { characterRequest } from "./character-type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Upload } from "lucide-react";
import { InputWithLabel } from "@/components/input-with-label";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { FormDataConverter } from "@/lib/form-data";
const DEFAULT_CHARACTER: characterRequest = {
  name: "",
  greeting: "",
  personality: "",
  uploads: [],
  description: "",
  exampleDialogue: "",
  instructions: "",
  scenario: "",
  tags: [],
};
type props = {
  onSubmitChanges: (formData: FormData) => void;
  isPending: boolean;
};
export default function CharacterForm({ onSubmitChanges }: props) {
  const [character, setCharacter] =
    useState<characterRequest>(DEFAULT_CHARACTER);
  const [open, setOpen] = useState(false);
  const image = useMemo(() => {
    const upload = character.uploads?.[0];
    if (!upload) return "/images/upload.png";

    return URL.createObjectURL(upload);
  }, [character.uploads]);

  const otherImages = useMemo(() => {
    if (!(character.uploads.length > 1)) return [];

    const slicedArray = character.uploads.slice(1);

    return slicedArray.map((x) => URL.createObjectURL(x));
  }, [character.uploads]);

  return (
    <Card className="w-xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = FormDataConverter.toFormData(character);
          onSubmitChanges(formData);
        }}
      >
        <CardHeader>
          <CardTitle>Create Character</CardTitle>
        </CardHeader>
        <CardContent className="py-2 space-y-5">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="w-64 h-64 relative mx-auto">
                <Image src={image} fill alt="no upload" />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-500 text-white"
                type="button"
                asChild
              >
                <Label>
                  <Upload /> <span>Upload image</span>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const files = e.currentTarget.files;
                      if (!files) return;

                      setCharacter((c) => ({
                        ...c,
                        uploads: [...c.uploads, ...files],
                      }));
                    }}
                  />
                </Label>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {otherImages.map((x, key) => (
                <div key={key} className="shrink-0">
                  <Image src={x} alt="" width={64} height={64} />
                </div>
              ))}
            </div>
          </div>
          <InputWithLabel
            label="Name"
            value={character.name}
            onChange={(e) =>
              setCharacter((c) => ({ ...c, name: e.target.value }))
            }
          />
          <TextAreaWithLabel
            label="Description"
            className="resize-none max-h-96"
            value={character.description ?? ""}
            onChange={(e) =>
              setCharacter((c) => ({ ...c, description: e.target.value }))
            }
          />
          <TextAreaWithLabel
            label="Greeting"
            className="resize-none max-h-96"
            value={character.greeting ?? ""}
            onChange={(e) =>
              setCharacter((c) => ({ ...c, greeting: e.target.value }))
            }
          />
          <TextAreaWithLabel
            label="Personality"
            className="resize-none max-h-96"
            value={character.personality}
            onChange={(e) =>
              setCharacter((c) => ({ ...c, personality: e.target.value }))
            }
          />
        </CardContent>
        <CardFooter className="py-1 flex flex-col space-y-2">
          <Button className="ml-auto bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
            <Plus /> <span>Create Character</span>
          </Button>
          <div
            suppressHydrationWarning
            className="text-xl w-full select-none cursor-pointer items-center flex flex-row justify-between
            border-b pb-2"
            onClick={() => setOpen(!open)}
          >
            <span>Optional Parameters</span>
            {open ? <ChevronUp /> : <ChevronDown />}
          </div>
          <div className={`${!open && "hidden"} w-full space-y-5`}>
            <TextAreaWithLabel
              label="Scenario"
              className="resize-none max-h-96"
              value={character.scenario ?? ""}
              onChange={(e) =>
                setCharacter((c) => ({ ...c, scenario: e.target.value }))
              }
            />
            <TextAreaWithLabel
              label="Example Dialogue"
              className="resize-none max-h-96"
              value={character.exampleDialogue ?? ""}
              onChange={(e) =>
                setCharacter((c) => ({ ...c, exampleDialogue: e.target.value }))
              }
            />
            <TextAreaWithLabel
              label="Instructions"
              className="resize-none max-h-96"
              value={character.instructions ?? ""}
              onChange={(e) =>
                setCharacter((c) => ({ ...c, instructions: e.target.value }))
              }
            />
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
