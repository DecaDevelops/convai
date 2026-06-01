"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import useModels from "@/features/model/model-context";
import ModelForm from "@/features/model/model-form";
import { ModelRequest, ModelSelect } from "@/features/model/model-types";
import useModelMutations from "@/features/model/use-model-mutation";
import { Plus, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";

const ModelTableRow: React.FC<{
  model: ModelSelect;
  onDelete: VoidFunction;
}> = memo(({ model, onDelete }) => {
  return (
    <TableRow>
      <TableCell>{model.name}</TableCell>
      <TableCell>{model.providerModelName}</TableCell>
      <TableCell>{model.description}</TableCell>
      <TableCell>{model.contextSize}</TableCell>
      <TableCell>{model.maxTokenResponse}</TableCell>
      <TableCell>
        <Button onClick={onDelete} variant={"ghost"} size={"icon"}>
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
});

ModelTableRow.displayName = "ModelTableRow";
export default function Client() {
  const { models } = useModels();
  const { doCreateModelAsync, doDelete, isPending } = useModelMutations();
  const [open, setOpen] = useState(false);
  const onRegisterModel = async (req: ModelRequest) => {
    try {
      await doCreateModelAsync(req);
      setOpen(false);
    } catch {
      //do something on error
    }
  };
  return (
    <div className="my-5 space-y-2">
      <div className="ml-auto w-fit">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} className="ml-auto">
              <Plus /> <span>Add Model</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Model</DialogTitle>
            </DialogHeader>
            <ModelForm onSendForm={onRegisterModel} isPending={isPending} />
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableCaption>Registered models</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Model name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Context size</TableHead>
            <TableHead>Max response tokens</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((x) => (
            <ModelTableRow
              model={x}
              onDelete={() => doDelete(x.id)}
              key={x.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
