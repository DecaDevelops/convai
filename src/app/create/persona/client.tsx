"use client";
import { createPersona } from "@/features/persona/persona-action";
import PersonaForm from "@/features/persona/persona-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Client() {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: createPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success("Persona has been created!");
      return push("/personas");
    },
    onError: (err) => toast.error(err.message),
  });
  return (
    <div className="w-xl mx-auto my-5">
      <PersonaForm isPending={isPending} onSendForm={mutate} />
    </div>
  );
}
