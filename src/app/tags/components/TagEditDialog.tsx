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
import { TagRequest, TagSelect } from "@/features/tag/tag-types";
import useTagMutations from "@/features/tag/use-tag-mutations";
import { Dispatch, SetStateAction } from "react";

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
