"use client";
import { Button } from "@/components/ui/button";
import { createCharacter, deleteCharacter } from "@/features/character/action";
import useCharacters from "@/features/character/context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import CharacterCard from "@/features/character/card";
import { toast } from "sonner";
import { createChat, createNewChat } from "@/features/chat/action";
import { useRouter } from "next/navigation";

export default function Client() {
  const { push } = useRouter();
  const { characters, isPending } = useCharacters();

  const { mutate: startChat } = useMutation({
    mutationFn: createChat,
    onSuccess: (data) => {
      push(`/chats/${data}`);
    },
  });

  const { mutate: startNewChat } = useMutation({
    mutationFn: createNewChat,
    onSuccess: (data) => push(`/chats/${data}`),
  });
  return (
    <>
      {isPending ? (
        "loading..."
      ) : (
        <div className="flex flex-wrap">
          {characters.map((x) => (
            <CharacterCard
              key={x.id}
              character={x}
              favorite={() => {}}
              isFavorite={false}
              onDelete={() => {}}
              startChat={() => startChat({ characterId: x.id })}
              startNewChat={() => startNewChat(x.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
