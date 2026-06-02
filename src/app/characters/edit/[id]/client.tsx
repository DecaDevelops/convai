"use client";
import { updateCharacter } from "@/features/character/character-action";
import CharacterForm from "@/features/character/character-form";
import { characterSelect } from "@/features/character/character-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Client({ character }: { character: characterSelect }) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateCharacter,
    onSuccess: () => {
      toast.success("Character has been updated");
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      push("/characters");
    },
    onError: (err) => toast.error(err.message),
  });
  return (
    <CharacterForm
      isPending={isPending}
      onSubmitChanges={(formData) => mutate({ id: character.id, formData })}
      _character={character}
    />
  );
}
