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
import useProvider from "@/features/provider/provider-context";
import {
  CreateProviderDialog,
  DeleteProviderDialog,
  UpdateProviderDialog,
} from "@/features/provider/provider-dialogs";
import { ProviderSelect } from "@/features/provider/provider-types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";

const ProviderTableRow: React.FC<{
  onDelete: VoidFunction;
  onEdit: VoidFunction;
  provider: ProviderSelect;
}> = memo(({ onDelete, onEdit, provider }) => {
  return (
    <>
      <TableRow>
        <TableCell>{provider.name}</TableCell>
        <TableCell>{provider.path}</TableCell>
        <TableCell>{provider.description}</TableCell>
        <TableCell>{provider.apiKeyId}</TableCell>
        <TableCell>
          <Button
            onClick={onEdit}
            variant={"ghost"}
            size={"icon"}
            className="cursor-pointer"
          >
            <Pencil />
          </Button>
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
    </>
  );
});

ProviderTableRow.displayName = "ProviderTableRow";

export default function Client() {
  const { providers } = useProvider();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [provider, setProvider] = useState<ProviderSelect | null>(null);
  return (
    <>
      <DeleteProviderDialog
        open={openDelete}
        setOpen={setOpenDelete}
        provider={provider}
        setProvider={setProvider}
      />
      <CreateProviderDialog open={openCreate} setOpen={setOpenCreate} />
      <UpdateProviderDialog
        provider={provider}
        setProvider={setProvider}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <div className="w-3/4 mx-auto my-5 space-y-2">
        <div className="w-fit ml-auto">
          <Button variant={"outline"} onClick={() => setOpenCreate(true)}>
            <Plus /> <span>Register new provider</span>
          </Button>
        </div>
        <Table>
          <TableCaption>Registered AI Providers</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>API key</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((x) => (
              <ProviderTableRow
                onDelete={() => {
                  setProvider(x);
                  setOpenDelete(true);
                }}
                onEdit={() => {
                  setProvider(x);
                  setOpenEdit(true);
                }}
                provider={x}
                key={x.id}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
