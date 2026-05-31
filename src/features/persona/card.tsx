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
import { PersonaSelect } from "./types";
import Image from "next/image";
type props = {
  persona: PersonaSelect;
};
function PersonaCard({ persona }: props) {
  const image = persona?.image ?? "/images/upload.png";
  return (
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
      <CardFooter></CardFooter>
    </Card>
  );
}

export default memo(PersonaCard);
