"use client";
import React from "react";
import { PersonaSelect } from "../../../../features/persona/persona-types";
import PersonaForm from "@/features/persona/persona-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updatePersona } from "@/features/persona/persona-action";
import { toast } from "sonner";

export default function Client({ persona }: { persona: PersonaSelect }) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updatePersona,
    onSuccess: () => {
      toast.success("Persona has been updated");
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      push("/personas");
    },
    onError: (err) => toast.error(err.message),
  });
  return (
    <div className="w-1/2 mx-auto">
      <PersonaForm
        isPending={false}
        onSendForm={(formData) => mutate({ id: persona.id, formData })}
        _persona={persona}
      />
    </div>
  );
}
