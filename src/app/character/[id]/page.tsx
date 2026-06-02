import { getCharacter } from "@/features/character/character-action";
import React from "react";
import Client from "./client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) return "Character not found";

  return (
    <div>
      <Client character={character} />
    </div>
  );
}
