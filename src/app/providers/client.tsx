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
import useProvider from "@/features/provider/provider-context";
import ProviderForm from "@/features/provider/provider-form";
import {
  ProviderRequest,
  ProviderSelect,
} from "@/features/provider/provider-types";
import useProviderMutations from "@/features/provider/use-provider-mutation";
import { Plus, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";

const ProviderTableRow: React.FC<{
  onDelete: VoidFunction;
  provider: ProviderSelect;
}> = memo(({ onDelete, provider }) => {
  return (
    <TableRow>
      <TableCell>{provider.name}</TableCell>
      <TableCell>{provider.path}</TableCell>
      <TableCell>{provider.description}</TableCell>
      <TableCell>{provider.apiKeyId}</TableCell>
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

ProviderTableRow.displayName = "ProviderTableRow";

export default function Client() {
  const { providers } = useProvider();
  const { mappedApiKeys } = useApiKeys();
  const { doCreateProviderAsync, doDeleteProvider } = useProviderMutations();
  const [open, setOpen] = useState(false);
  const onProviderCreate = async (req: ProviderRequest) => {
    try {
      await doCreateProviderAsync(req);
      setOpen(false);
    } catch {
      // do something here if needed
    }
  };
  return (
    <div className="w-full my-5 space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="float-right">
          <Button variant={"outline"}>
            <Plus /> <span>Register new provider</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register a new provider</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Need to register a new provider? You can do that here
          </DialogDescription>
          <ProviderForm isPending={false} onSendForm={onProviderCreate} />
        </DialogContent>
      </Dialog>
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
              onDelete={() => doDeleteProvider(x.id)}
              provider={x}
              key={x.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
