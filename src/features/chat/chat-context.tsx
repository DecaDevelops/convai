"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { PersonaSelect } from "../persona/persona-types";
import { ChatSelect } from "./chat-types";
import { characterSelect } from "../character/character-type";
import useCharacters from "../character/character-context";
import usePersonas from "../persona/persona-context";
import { useChatMutations } from "./use-chat-mutation";
import { InterferenceProfileSelect } from "../interference-profile/interference-profile-types";
import useInterferenceProfiles from "../interference-profile/interference-profile-context";

type ChatActionState = {
  chatId: string;
  activePersona: PersonaSelect | null;
  activeProfile: InterferenceProfileSelect | null;
  character: characterSelect | null;
  setActivePersona: (personaId: string | null) => void;
  setActiveProfile: (profileId: string | null) => void;
};

const ChatContext = createContext<ChatActionState | undefined>(undefined);

type props = {
  Chat: ChatSelect;
} & PropsWithChildren;
export function ChatContextProvider({ Chat, children }: props) {
  const chatId = Chat.id;
  const { mappedCharacters } = useCharacters();
  const { mappedPersonas } = usePersonas();
  const { mappedInterferenceProfiles } = useInterferenceProfiles();
  const { doUpdateActivePersona, doUpdateActiveProfile, isPending } =
    useChatMutations();
  const [activePersonaId, setActivePersonaId] = useState(Chat.personaId);
  const [activeProfileId, setActiveProfileId] = useState(
    Chat.interferenceProfileId,
  );
  const activeProfile = activeProfileId
    ? (mappedInterferenceProfiles.get(activeProfileId) ?? null)
    : null;

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
  const setActiveProfile = (profileId: string | null) => {
    if (profileId == activeProfileId) return;

    setActiveProfileId(profileId);
    doUpdateActiveProfile({ chatId, profileId });
  };
  return (
    <ChatContext.Provider
      value={{
        chatId,
        activePersona,
        activeProfile,
        character,
        setActivePersona,
        setActiveProfile,
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
