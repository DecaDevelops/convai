import React, { createContext, PropsWithChildren, useContext } from "react";
import { InterferenceProfileSelect } from "./interference-profile-types";
import { useQuery } from "@tanstack/react-query";
import { getInterferenceProfiles } from "./interference-profile.action";

// InterferenceProfilesContext
type InterferenceProfilesActionState = {
  interferenceProfiles: InterferenceProfileSelect[];
  mappedInterferenceProfiles: Map<string, InterferenceProfileSelect>;
};

const InterferenceProfilesContext = createContext<
  InterferenceProfilesActionState | undefined
>(undefined);

export function InterferenceProfilesContextProvider({
  children,
}: PropsWithChildren) {
  const { data: interferenceProfiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: getInterferenceProfiles,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const mappedInterferenceProfiles = new Map(
    interferenceProfiles.map((x) => [x.id, x]),
  );
  return (
    <InterferenceProfilesContext.Provider
      value={{ interferenceProfiles, mappedInterferenceProfiles }}
    >
      {children}
    </InterferenceProfilesContext.Provider>
  );
}

export default function useInterferenceProfiles() {
  const ctx = useContext(InterferenceProfilesContext);
  if (!ctx)
    throw new Error(
      "useInterferenceProfiles must be used within a InterferenceProfilesContextProvider",
    );

  return ctx;
}
