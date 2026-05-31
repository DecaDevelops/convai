import { createContext, PropsWithChildren, useContext } from "react";
import { PersonaSelect } from "./types";
import { useQuery } from "@tanstack/react-query";
import { getPersonas } from "./action";

type PersonaActionState = {
  personas: PersonaSelect[];
  mappedPersonas: Map<string, PersonaSelect>;
  processing: boolean;
};

const PersonaContext = createContext<PersonaActionState | undefined>(undefined);

export function PersonaContextProvider({ children }: PropsWithChildren) {
  const {
    data: personas = [],
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["personas"],
    queryFn: getPersonas,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const mappedPersonas = new Map(personas.map((x) => [x.id, x] as const));
  const processing = isLoading || isPending;
  return (
    <PersonaContext.Provider value={{ processing, personas, mappedPersonas }}>
      {children}
    </PersonaContext.Provider>
  );
}

export default function usePersonas() {
  const ctx = useContext(PersonaContext);
  if (!ctx)
    throw new Error("usePersonas must be used within a PersonaContextProvider");

  return ctx;
}
