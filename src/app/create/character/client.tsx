"use client";
import CharacterForm from "@/features/character/character-form";
import { useCharacterMutations } from "@/features/character/use-character-mutations";
import React from "react";

export default function Client() {
  const { doCreateCharacter, isPendingCharacterMutate } =
    useCharacterMutations();
  return (
    <CharacterForm
      onSubmitChanges={doCreateCharacter}
      isPending={isPendingCharacterMutate}
    />
  );
}
