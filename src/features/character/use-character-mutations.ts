"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCharacter,
  deleteCharacter,
  updateCharacter,
} from "./character-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { onImportCharacter } from "./import/use-character-import";

export function useCharacterMutations() {
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const invalidateQuery = () =>
    queryClient.invalidateQueries({ queryKey: ["characters"] });

  const { mutate: doCreateCharacter, isPending: isPendingCreate } = useMutation(
    {
      mutationFn: createCharacter,
      onSuccess: () => {
        toast.success("Character has been created");
        invalidateQuery();
        push(`/characters`);
      },
      onError: (err) => toast.error(err.message),
    },
  );

  const {
    mutate: doDeleteCharacter,
    mutateAsync: doDeleteCharacterAsync,
    isPending: isPendingDelete,
  } = useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () => {
      toast.success("Character has been deleted");
      invalidateQuery();
    },
    onError: (err) => toast.error(err.message),
  });
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

  const { mutateAsync: doImportCharacterAsync, isPending: isPendingImport } =
    useMutation({
      mutationFn: onImportCharacter,
      onSuccess: () => {
        invalidateQuery();
        toast.success("Character(s) have been imported");
      },
      onError: (err) => toast.error(err.message),
    });
  const isPendingCharacterMutate =
    isPendingCreate || isPendingDelete || isPendingUpdate || isPendingImport;

  return {
    doCreateCharacter,
    doUpdateCharacter,
    doDeleteCharacter,
    doDeleteCharacterAsync,
    doImportCharacterAsync,
    isPendingCharacterMutate,
  };
}
