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
import useModels from "@/features/model/model-context";
import {
  CreateModelDialog,
  DeleteModelDialog,
  EditModelDialog,
} from "@/features/model/model-dialogs";
import { ModelSelect } from "@/features/model/model-types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";

const ModelTableRow: React.FC<{
  model: ModelSelect;
  onDelete: VoidFunction;
  onEdit: VoidFunction;
}> = memo(({ model, onDelete, onEdit }) => {
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
        <Button onClick={onEdit} variant={"ghost"} size={"icon"}>
          <Pencil />
        </Button>
      </TableCell>
    </TableRow>
  );
});

ModelTableRow.displayName = "ModelTableRow";
export default function Client() {
  const { models } = useModels();

  const [model, setModel] = useState<ModelSelect | null>(null);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <>
      <DeleteModelDialog
        model={model}
        open={isOpenDelete}
        setModel={setModel}
        setOpen={setIsOpenDelete}
      />
      <EditModelDialog
        model={model}
        open={isOpenEdit}
        setModel={setModel}
        setOpen={setIsOpenEdit}
      />
      <CreateModelDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
      <div className="my-5">
        <div className="w-fit ml-auto my-2">
          <Button
            variant={"outline"}
            className="ml-auto"
            onClick={() => setIsOpenCreate(true)}
          >
            <Plus /> <span>Add Model</span>
          </Button>
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
                onDelete={() => {
                  setIsOpenDelete(true);
                  setModel(x);
                }}
                onEdit={() => {
                  setIsOpenEdit(true);
                  setModel(x);
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
