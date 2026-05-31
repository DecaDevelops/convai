"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CharacterContextProvider } from "@/features/character/context";
import { PersonaContextProvider } from "@/features/persona/context";
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
              <PersonaContextProvider>{children}</PersonaContextProvider>
            </CharacterContextProvider>
          </TooltipProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </>
  );
}
