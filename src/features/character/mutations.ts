"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCharacter, deleteCharacter, updateCharacter } from "./action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCharacterMutations() {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { mutate: doCreateCharacter, isPending: isPendingCreate } = useMutation(
    {
      mutationFn: createCharacter,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["characters"] });
        toast.success("Character has been created");
        push(`/characters`);
      },
      onError: (err) => toast.error(err.message),
    },
  );

  const { mutate: doDeleteCharacter, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: deleteCharacter,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["characters"] });
      },
      onError: (err) => toast.error(err.message),
    },
  );
  const { mutate: doUpdateCharacter, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: updateCharacter,
      onSuccess: () => {
        toast.success("Character has been updated");
        queryClient.invalidateQueries({ queryKey: ["characters"] });
        push(`/characters`);
      },
    },
  );
  const isPendingCharacterMutate =
    isPendingCreate || isPendingDelete || isPendingUpdate;

  return {
    doCreateCharacter,
    doUpdateCharacter,
    doDeleteCharacter,
    isPendingCharacterMutate,
  };
}
