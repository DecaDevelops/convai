"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TagForm from "@/features/tag/tag-form";
import { TagRequest } from "@/features/tag/tag-types";
import useTagMutations from "@/features/tag/use-tag-mutations";
import React, { Dispatch, SetStateAction, useState } from "react";

export default function TagCreateDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { doCreateTagAsync, isPending } = useTagMutations();

  const [version, setVersion] = useState(0);

  const onSubmitForm = async (req: TagRequest) => {
    try {
      await doCreateTagAsync(req);
      setVersion(version + 1);
    } catch {
      // additional error handling if needed
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>
        <DialogDescription>Tag creation</DialogDescription>
        <TagForm isPending={isPending} onSubmit={onSubmitForm} key={version} />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
