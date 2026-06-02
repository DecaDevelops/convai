"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPersona, deletePersona } from "./persona-action";
import { toast } from "sonner";

export function usePersonaMutations() {
  const queryClient = useQueryClient();
  const invalidateQuery = (toastMsg?: string) => {
    queryClient.invalidateQueries({ queryKey: ["personas"] });
    if (toastMsg) toast.success(toastMsg);
  };
  const { push } = useRouter();

  const { mutate: doCreatePersona, isPending: isCreatePersona } = useMutation({
    mutationFn: createPersona,
    onSuccess: () => {
      invalidateQuery("Persona has been created");
      push(`/personas`);
    },
    onError: (err) => toast.error(err.message),
  });
  const { mutateAsync: doDeletePersonaAsync, isPending: isPendingDelete } =
    useMutation({
      mutationFn: deletePersona,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["personas"] });
        toast.success("persona has been deleted");
      },
      onError: (err) => toast.error(err.message),
    });

  const isPendingPersona = isPendingDelete || isCreatePersona;

  return {
    doDeletePersonaAsync,
    doCreatePersona,
    isPendingPersona,
  };
}
