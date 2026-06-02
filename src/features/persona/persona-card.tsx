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
import { PersonaSelect } from "./persona-types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePersonaMutations } from "./use-persona-mutations";
import { exportPersona } from "./export/persona-export-action";
import { safeFileName } from "@/lib/safe-name";
type props = {
  persona: PersonaSelect;
};
function PersonaCard({ persona }: props) {
  const image = persona?.image ?? "/images/upload.png";
  const { doDeletePersonaAsync } = usePersonaMutations();
  const onDelete = async () => {
    try {
      await doDeletePersonaAsync(persona.id);
      setOpen(false);
    } catch {
      //do something on error
    }
  };

  const onExportPersona = async () => {
    const blob = await exportPersona(persona.id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFileName(persona.name)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {persona.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this persona? Once deleted it cannot
            be recovered
          </DialogDescription>
          <DialogFooter className="py-1 mt-auto">
            <Button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
            >
              <Trash2 /> <span>Delete</span>
            </Button>
            <DialogClose asChild>
              <Button variant={"outline"} className="ml-auto cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-xs shrink-0">
        <CardHeader>
          <CardTitle className="text-center text-xl">{persona.name}</CardTitle>
          <div className="relative w-64 h-64">
            <Image
              src={image}
              alt={persona.name}
              style={{ objectFit: "contain" }}
              fill
            />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center line-clamp-5">
            {persona.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="mt-auto py-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto">
              <Button variant={"ghost"} className="cursor-pointer">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/personas/edit/${persona.id}`}>
                  <Pencil /> <span>Edit persona</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash2 /> <span>Delete Persona</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPersona}>
                <Download /> <span>Export Persona</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </>
  );
}

export default memo(PersonaCard);
