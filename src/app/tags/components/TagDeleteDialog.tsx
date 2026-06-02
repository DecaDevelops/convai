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
import { TagSelect } from "@/features/tag/tag-types";
import useTagMutations from "@/features/tag/use-tag-mutations";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function TagDeleteDialog({
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
