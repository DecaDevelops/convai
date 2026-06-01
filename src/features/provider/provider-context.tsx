"use client";
import { createContext, PropsWithChildren, useContext } from "react";
import { ProviderSelect } from "./provider-types";
import { useQuery } from "@tanstack/react-query";
import { getProviders } from "./provider-action";

type ProviderActionState = {
  providers: ProviderSelect[];
  mappedProviders: Map<string, ProviderSelect>;
};

const ProviderContext = createContext<ProviderActionState | undefined>(
  undefined,
);

export function ProviderContextProvider({ children }: PropsWithChildren) {
  const { data: providers = [] } = useQuery({
    queryKey: ["providers"],
    queryFn: getProviders,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const mappedProviders = new Map(providers.map((x) => [x.id, x]));

  return (
    <ProviderContext.Provider value={{ providers, mappedProviders }}>
      {children}
    </ProviderContext.Provider>
  );
}

export default function useProvider() {
  const ctx = useContext(ProviderContext);
  if (!ctx)
    throw new Error(
      "useProvider must be used within a ProviderContextProvider",
    );

  return ctx;
}
