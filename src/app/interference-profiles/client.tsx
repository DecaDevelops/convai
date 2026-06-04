"use client";
import { Button } from "@/components/ui/button";
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
import {
  CreateInterferenceProfileDialog,
  DeleteInterferenceProfileDialog,
  UpdateInterferenceProfileDialog,
} from "@/features/interference-profile/interference-profile-dialogs";
import { InterferenceProfileSelect } from "@/features/interference-profile/interference-profile-types";
import useModels from "@/features/model/model-context";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";

const InterferenceProfileTableRow: React.FC<{
  profile: InterferenceProfileSelect;
  modelName?: string;
  onDelete: VoidFunction;
  onEdit: VoidFunction;
}> = memo(({ profile, modelName, onDelete, onEdit }) => {
  return (
    <TableRow>
      <TableCell>{profile.name ?? "N/A"}</TableCell>
      <TableCell>{profile.description ?? "N/A"}</TableCell>
      <TableCell>{modelName ?? "N/A"}</TableCell>
      <TableCell>{profile.temperature / 100}</TableCell>
      <TableCell>{profile.topK}</TableCell>
      <TableCell>{profile.topP / 100}</TableCell>
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
        <Button
          variant={"ghost"}
          size={"icon"}
          className="cursor-pointer"
          onClick={onEdit}
        >
          <Pencil />
        </Button>
      </TableCell>
    </TableRow>
  );
});

InterferenceProfileTableRow.displayName = "InterferenceProfileTableRow";

export default function Client() {
  const { interferenceProfiles } = useInterferenceProfiles();
  const { mappedModels } = useModels();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [profile, setProfile] = useState<InterferenceProfileSelect | null>(
    null,
  );
  return (
    <>
      <CreateInterferenceProfileDialog
        open={openCreate}
        setOpen={setOpenCreate}
      />
      <UpdateInterferenceProfileDialog
        open={openEdit}
        profile={profile}
        setProfile={setProfile}
        setOpen={setOpenEdit}
      />
      <DeleteInterferenceProfileDialog
        open={openDelete}
        profile={profile}
        setOpen={setOpenDelete}
        setProfile={setProfile}
      />

      <div className="w-3/4 mx-auto my-5 space-y-2">
        <div className="w-fit ml-auto">
          <Button variant={"outline"} onClick={() => setOpenCreate(true)}>
            <Plus /> <span>Create New Profile</span>
          </Button>
        </div>
        <Table>
          <TableCaption>Registered Interference Profiles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>(Nick)name</TableHead>
              <TableHead>Description</TableHead>
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
                onDelete={() => {
                  setProfile(x);
                  setOpenDelete(true);
                }}
                onEdit={() => {
                  setOpenEdit(true);
                  setProfile(x);
                }}
                key={x.id}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
