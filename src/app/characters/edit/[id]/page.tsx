import React from "react";
import Client from "./client";
import { getCharacter } from "@/features/character/character-action";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) return "Not found";

  return <Client character={character} key={character.id} />;
}
