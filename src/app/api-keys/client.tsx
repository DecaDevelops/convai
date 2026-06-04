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
import useApiKeys from "@/features/apiKey/api-keys-context";
import {
  CreateApiKeyDialog,
  DeleteApiKeyDialog,
  UpdateApiKeyDialog,
} from "@/features/apiKey/api-keys-dialogs";
import { ApiKeysSelect } from "@/features/apiKey/api-keys-types";
import { setClipboard } from "@/lib/write-to-clipboard";
import { Eye, EyeClosed, Pencil, Plus, Trash2 } from "lucide-react";
import React, { memo, useMemo, useState } from "react";

const ApiKeyRow: React.FC<{
  apiKey: ApiKeysSelect;
  onDelete: VoidFunction;
  onEdit: VoidFunction;
}> = memo(({ apiKey, onDelete, onEdit }) => {
  const [show, setShow] = useState(false);

  const showValue = useMemo(() => {
    if (!show) return "**********";

    return apiKey.value;
  }, [show, apiKey.value]);
  return (
    <TableRow>
      <TableCell>{apiKey.name}</TableCell>
      <TableCell>{apiKey.description}</TableCell>
      <TableCell className="flex flex-row items-center">
        <span
          className="w-fit cursor-pointer"
          onClick={() => setClipboard(apiKey.value)}
        >
          {showValue}
        </span>
        <div className="w-fit h-fit ml-auto mb-auto">
          <Button
            onClick={() => setShow(!show)}
            size={"icon"}
            variant={"ghost"}
          >
            {show ? <EyeClosed /> : <Eye />}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Button size={"icon"} variant={"ghost"} onClick={onEdit}>
          <Pencil />
        </Button>
        <Button size={"icon"} variant={"ghost"} onClick={onDelete}>
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
});

ApiKeyRow.displayName = "ApiKeyRow";

export default function Client() {
  const { apiKeys } = useApiKeys();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [apiKey, setApiKey] = useState<ApiKeysSelect | null>(null);
  return (
    <>
      <CreateApiKeyDialog open={openCreate} setOpen={setOpenCreate} />
      <DeleteApiKeyDialog
        open={openDelete}
        setOpen={setOpenDelete}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
      <UpdateApiKeyDialog
        setApiKey={setApiKey}
        apiKey={apiKey}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <div className="w-3/4  mx-auto my-5">
        <div className="w-fit ml-auto">
          <Button onClick={() => setOpenCreate(true)}>
            <Plus /> <span>Register new provider</span>
          </Button>
        </div>
        <Table>
          <TableCaption>Your registered api keys.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((x) => (
              <ApiKeyRow
                apiKey={x}
                key={x.id}
                onDelete={() => {
                  setApiKey(x);
                  setOpenDelete(true);
                }}
                onEdit={() => {
                  setApiKey(x);
                  setOpenEdit(true);
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
