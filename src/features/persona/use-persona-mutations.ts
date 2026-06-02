"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPersona, deletePersona } from "./persona-action";
import { toast } from "sonner";
import { PersonaImport } from "./persona-types";
import { FormDataConverter } from "@/lib/form-data";
import { PersonaMapper } from "./persona-mapper";

const onImportPersonas = async (personas: PersonaImport[]) => {
  for (const persona of personas) {
    const formData = FormDataConverter.toFormData(
      PersonaMapper.mapImportToRequest(persona),
    );
    if (persona.image instanceof Blob) {
      formData.append("upload", persona.image, "persona_1.webp");
    }
    await createPersona(formData);
  }
  return true;
};

export function usePersonaMutations() {
  const queryClient = useQueryClient();

  // const invalidateQuery = () => queryClient.invalidateQueries({ queryKey: ["personas"]})
  const invalidateQuery = () =>
    queryClient.invalidateQueries({ queryKey: ["personas"] });
  const { push } = useRouter();

  const { mutate: doCreatePersona, isPending: isCreatePersona } = useMutation({
    mutationFn: createPersona,
    onSuccess: () => {
      invalidateQuery();
      toast.success("Persona has been created");
      push(`/personas`);
    },
    onError: (err) => toast.error(err.message),
  });
  const { mutateAsync: doDeletePersonaAsync, isPending: isPendingDelete } =
    useMutation({
      mutationFn: deletePersona,
      onSuccess: () => {
        invalidateQuery();
        toast.success("persona has been deleted");
      },
      onError: (err) => toast.error(err.message),
    });

  const { mutateAsync: doImportPersonaAsync, isPending: isPendingImport } =
    useMutation({
      mutationFn: onImportPersonas,
      onSuccess: () => {
        invalidateQuery();
        toast.success("Persona(s) have been imported");
      },
    });
  const isPendingPersona =
    isPendingDelete || isCreatePersona || isPendingImport;

  return {
    doDeletePersonaAsync,
    doCreatePersona,
    doImportPersonaAsync,
    isPendingPersona,
  };
}
