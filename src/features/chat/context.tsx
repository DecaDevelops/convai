"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { PersonaSelect } from "../persona/types";
import { ChatSelect } from "./types";
import { characterSelect } from "../character/type";
import useCharacters from "../character/context";
import usePersonas from "../persona/context";
import { useChatMutations } from "./use-chat-mutation";

type ChatActionState = {
  activePersona: PersonaSelect | null;
  character: characterSelect | null;
  setActivePersona: (personaId: string) => void;
};

const ChatContext = createContext<ChatActionState | undefined>(undefined);

type props = {
  Chat: ChatSelect;
} & PropsWithChildren;
export function ChatContextProvider({ Chat, children }: props) {
  const chatId = Chat.id;
  const { mappedCharacters } = useCharacters();
  const { mappedPersonas } = usePersonas();
  const { doUpdateActivePersona, isPending } = useChatMutations();
  const [activePersonaId, setActivePersonaId] = useState(
    Chat.personaId ?? null,
  );

  const character = Chat.characterId
    ? (mappedCharacters.get(Chat.characterId) ?? null)
    : null;
  const activePersona = activePersonaId
    ? (mappedPersonas.get(activePersonaId) ?? null)
    : null;

  const setActivePersona = (personaId: string | null) => {
    if (personaId === activePersonaId) return;
    setActivePersonaId(personaId);
    // void update active persona
    doUpdateActivePersona({ chatId, personaId });
  };
  return (
    <ChatContext.Provider
      value={{
        activePersona,
        character,
        setActivePersona,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx)
    throw new Error("useChatting must be used within ChattingContextProvider");
  return ctx;
}
