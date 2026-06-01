"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useInterferenceProfiles from "@/features/interference-profile/interference-profile-context";
import InterferenceProfileForm from "@/features/interference-profile/interference-profile-form";
import {
  InterferenceProfileRequest,
  InterferenceProfileSelect,
} from "@/features/interference-profile/interference-profile-types";
import useInterferenceProfileMutations from "@/features/interference-profile/use-interference-profile-mutations";
import useModels from "@/features/model/model-context";
import { Plus, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";

const InterferenceProfileTableRow: React.FC<{
  profile: InterferenceProfileSelect;
  modelName?: string;
  onDelete: VoidFunction;
}> = memo(({ profile, modelName, onDelete }) => {
  return (
    <TableRow>
      <TableCell>{modelName ?? "N/A"}</TableCell>
      <TableCell>{profile.temperature}</TableCell>
      <TableCell>{profile.topK}</TableCell>
      <TableCell>{profile.topP}</TableCell>
      <TableCell>{profile.maxResponseTokens ?? "N/A"}</TableCell>
      <TableCell>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="cursor-pointer"
          onClick={onDelete}
        >
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
});

InterferenceProfileTableRow.displayName = "InterferenceProfileTableRow";

export default function Client() {
  const { interferenceProfiles } = useInterferenceProfiles();
  const { mappedModels } = useModels();
  const {
    doCreateInterferenceProfileAsync,
    doDeleteInterferenceProfile,
    isPending,
  } = useInterferenceProfileMutations();
  const [open, setOpen] = useState(false);

  const onProfileCreate = async (req: InterferenceProfileRequest) => {
    try {
      await doCreateInterferenceProfileAsync(req);
      setOpen(false);
    } catch {
      // Error is handled by the mutation hook with toast
    }
  };

  return (
    <div className="w-full my-5 space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="float-right">
          <Button variant={"outline"}>
            <Plus /> <span>Create New Profile</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Interference Profile</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Configure model parameters for fine-tuned control over AI responses
          </DialogDescription>
          <InterferenceProfileForm
            isPending={isPending}
            onSendForm={onProfileCreate}
          />
        </DialogContent>
      </Dialog>
      <Table>
        <TableCaption>Registered Interference Profiles</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Top K</TableHead>
            <TableHead>Top P</TableHead>
            <TableHead>Max Tokens</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interferenceProfiles.map((x) => (
            <InterferenceProfileTableRow
              profile={x}
              modelName={
                x.modelId
                  ? (mappedModels.get(x.modelId)?.name ?? undefined)
                  : undefined
              }
              onDelete={() => doDeleteInterferenceProfile(x.id)}
              key={x.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
