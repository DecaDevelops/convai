"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCharacter,
  deleteCharacter,
  updateCharacter,
} from "./character-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CharacterImport } from "./character-type";
import { FormDataConverter } from "@/lib/form-data";
import { CharacterMapper } from "./character-mapper";
export const onImportCharacter = async (req: CharacterImport[]) => {
  for (const character of req) {
    const formData = FormDataConverter.toFormData(
      CharacterMapper.importToRequest(character),
    );
    const image = character?.image?.[0];
    if (image instanceof Blob) {
      formData.append("file", image, "character_1.webp");
    }

    await createCharacter(formData);
  }
  return true;
};

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
