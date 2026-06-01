"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { ModelSelect } from "./model-types";
import { useQuery } from "@tanstack/react-query";
import { getModels } from "./model-action";

type ModelActionState = {
  models: ModelSelect[];
  mappedModels: Map<string, ModelSelect>;
};

const ModelContext = createContext<ModelActionState | undefined>(undefined);

export function ModelContextProvider({ children }: PropsWithChildren) {
  const { data: models = [] } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    staleTime: Infinity,
    refetchOnReconnect: false,
  });
  const mappedModels = new Map(models.map((x) => [x.id, x]));

  return (
    <ModelContext.Provider value={{ models, mappedModels }}>
      {children}
    </ModelContext.Provider>
  );
}

export default function useModels() {
  const ctx = useContext(ModelContext);
  if (!ctx)
    throw new Error("useModels must be used within a ModelContextProvider");

  return ctx;
}
