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
import useApiKeys from "@/features/apiKey/api-keys-context";
import ApiKeysForm from "@/features/apiKey/api-keys-form";
import useApiKeysMutations from "@/features/apiKey/api-keys-mutations";
import { ApiKeyRequest, ApiKeysSelect } from "@/features/apiKey/api-keys-types";
import { Plus, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";

const ApiKeyRow: React.FC<{
  apiKey: ApiKeysSelect;
  onDelete: VoidFunction;
}> = memo(({ apiKey, onDelete }) => {
  return (
    <TableRow>
      <TableCell>{apiKey.name}</TableCell>
      <TableCell>{apiKey.description}</TableCell>
      <TableCell>**********</TableCell>
      <TableCell>
        <Button size={"icon"} variant={"ghost"} onClick={onDelete}>
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
});

ApiKeyRow.displayName = "ApiKeyRow";

export default function Client() {
  const { apiKeys, isLoading } = useApiKeys();
  const [open, setOpen] = useState(false);
  const { doCreateApiKeyAsync, doDeleteApiKey, isPending } =
    useApiKeysMutations();
  const onSubmitForm = async (newKey: ApiKeyRequest) => {
    try {
      await doCreateApiKeyAsync(newKey);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="my-5">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="mb-3">
          <Button className="float-right cursor-pointer" variant={"outline"}>
            <Plus /> <span>Register new api key</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Api key</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You can create a quick api key here
          </DialogDescription>
          <ApiKeysForm sendForm={onSubmitForm} />
        </DialogContent>
      </Dialog>
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
              onDelete={() => doDeleteApiKey(x.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
