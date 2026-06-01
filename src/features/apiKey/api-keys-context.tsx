"use client";
import { createContext, PropsWithChildren, useContext } from "react";
import { ApiKeysSelect } from "./api-keys-types";
import { useQuery } from "@tanstack/react-query";
import { getApiKeys } from "./api-keys-action";

type ApiKeyActionState = {
  apiKeys: ApiKeysSelect[];
  mappedApiKeys: Map<string, ApiKeysSelect>;
  isLoading: boolean;
};

const ApiKeyContext = createContext<ApiKeyActionState | undefined>(undefined);

export function ApiKeyContextProvider({ children }: PropsWithChildren) {
  const {
    data: apiKeys = [],
    isPending,
    isLoading,
  } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: getApiKeys,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const mappedApiKeys = new Map(apiKeys.map((x) => [x.id, x]));
  return (
    <ApiKeyContext.Provider
      value={{ apiKeys, mappedApiKeys, isLoading: isPending || isLoading }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export default function useApiKeys() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx)
    throw new Error("useApiKeys must be used within a ApiKeyContextProvider");

  return ctx;
}
