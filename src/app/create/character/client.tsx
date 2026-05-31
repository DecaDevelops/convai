"use client";
import CharacterForm from "@/features/character/form";
import { useCharacterMutations } from "@/features/character/mutations";
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
