"use client";
import { createContext, PropsWithChildren, useContext } from "react";
import { TagSelect } from "./tag-types";
import { useQuery } from "@tanstack/react-query";
import { getTags } from "./tag-action";

type TagActionState = {
  tags: TagSelect[];
  mappedTags: Map<string, TagSelect>;
  isLoadingTags: boolean;
};

const TagContext = createContext<TagActionState | undefined>(undefined);

export function TagContextProvider({ children }: PropsWithChildren) {
  const {
    data: tags = [],
    isPending,
    isLoading,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const mappedTags = new Map(tags.map((x) => [x.name, x]));

  return (
    <TagContext.Provider
      value={{ isLoadingTags: isPending || isLoading, mappedTags, tags }}
    >
      {children}
    </TagContext.Provider>
  );
}

export default function useTags() {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error("useTags TagContextProvider");

  return ctx;
}
