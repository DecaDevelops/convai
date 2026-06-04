"use client";
import { Button } from "@/components/ui/button";
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
import { TagRequest, TagSelect } from "@/features/tag/tag-types";
import useTagMutations from "@/features/tag/use-tag-mutations";
import { Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
export function TagCreateDialog({
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

export function TagDeleteDialog({
  open,
  setOpen,
  tag,
}: {
  tag: TagSelect;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { doDeleteTagAsync } = useTagMutations();
  const onDoDelete = async () => {
    try {
      await doDeleteTagAsync(tag.id);
      setOpen(false);
    } catch {
      // do something
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete the tag {tag.name}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Once deleted, this action cannot be reverted
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onDoDelete}>
            <Trash2 /> <span>Delete tag</span>
          </Button>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TagEditDialog({
  tag,
  open,
  setOpen,
}: {
  tag: TagSelect;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { doUpdateTagAsync, isPending } = useTagMutations();
  const onUpdateTag = async (req: TagRequest) => {
    try {
      await doUpdateTagAsync({ tagId: tag.id, req });
      setOpen(false);
    } catch {
      // do some additional error handling
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tag: {tag.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>Edit an existing tag</DialogDescription>
        <TagForm
          onSubmit={onUpdateTag}
          isPending={isPending}
          _tag={{ name: tag.name, description: tag.description }}
        />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
