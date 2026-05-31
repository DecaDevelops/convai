import { createContext, PropsWithChildren, useContext } from "react";
import { characterSelect } from "./type";
import { useQuery } from "@tanstack/react-query";
import { getCharacters } from "./action";
import { useChatMutations } from "../chat/use-chat-mutation";

type CharacterActionState = {
  characters: characterSelect[];
  mappedCharacters: Map<string, characterSelect>;
  isPending: boolean;
};

const CharacterContext = createContext<CharacterActionState | undefined>(
  undefined,
);

export function CharacterContextProvider({ children }: PropsWithChildren) {
  const { data: characters = [], isPending } = useQuery({
    queryKey: ["characters"],
    queryFn: getCharacters,
    refetchOnWindowFocus: false,
  });
  const mappedCharacters = new Map(characters.map((x) => [x.id, x] as const));
  return (
    <CharacterContext.Provider
      value={{ mappedCharacters, characters, isPending }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export default function useCharacters() {
  const ctx = useContext(CharacterContext);
  if (!ctx)
    throw new Error(
      "useCharacters must be used within a CharacterContextProvider",
    );

  return ctx;
}
