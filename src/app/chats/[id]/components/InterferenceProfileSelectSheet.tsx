"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useChat from "@/features/chat/chat-context";
import useInterferenceProfiles from "@/features/interference-profile/interference-profile-context";
import { InterferenceProfileSelect } from "@/features/interference-profile/interference-profile-types";
import React, { Dispatch, memo, SetStateAction } from "react";

const InterferenceProfileCard: React.FC<{
  isSelected: boolean;
  profile: InterferenceProfileSelect;
  onSelect: VoidFunction;
}> = memo(({ isSelected, onSelect, profile }) => {
  return (
    <Card onClick={onSelect}>
      <CardHeader>
        <CardTitle>{profile.modelId}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>{isSelected && <Badge>Enabled</Badge>}</CardFooter>
    </Card>
  );
});

InterferenceProfileCard.displayName = "InterferenceProfileCard";

export default function InterferenceProfileSelectSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { activeProfile, setActiveProfile } = useChat();
  const { interferenceProfiles } = useInterferenceProfiles();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="w-1/2 mx-auto min-h-[90vh]">
        <SheetHeader>
          <SheetTitle>Select Interference Profile</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Change your current interference model with another
        </SheetDescription>
        <div className="max-h-3/4">
          {interferenceProfiles.map((x) => (
            <InterferenceProfileCard
              key={x.id}
              isSelected={x.id === activeProfile?.id}
              onSelect={() => setActiveProfile(x.id)}
              profile={x}
            />
          ))}
        </div>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
