"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiKeyContextProvider } from "@/features/apiKey/api-keys-context";
import { CharacterContextProvider } from "@/features/character/character-context";
import { ModelContextProvider } from "@/features/model/model-context";
import { PersonaContextProvider } from "@/features/persona/persona-context";
import { ProviderContextProvider } from "@/features/provider/provider-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function App({ children }: PropsWithChildren) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            <CharacterContextProvider>
              <PersonaContextProvider>
                <ApiKeyContextProvider>
                  <ProviderContextProvider>
                    <ModelContextProvider>{children}</ModelContextProvider>
                  </ProviderContextProvider>
                </ApiKeyContextProvider>
              </PersonaContextProvider>
            </CharacterContextProvider>
          </TooltipProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </>
  );
}
