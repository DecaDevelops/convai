import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import TagEditDialog, { TagDeleteDialog } from "@/features/tag/tag-dialogs";
import { TagSelect } from "@/features/tag/tag-types";
import useTagMutations from "@/features/tag/use-tag-mutations";
import { Pencil, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";
function TagTableRow({ tag }: { tag: TagSelect }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <TagEditDialog open={openEdit} setOpen={setOpenEdit} tag={tag} />
      <TagDeleteDialog open={openDelete} setOpen={setOpenDelete} tag={tag} />
      <TableRow>
        <TableCell>{tag.name}</TableCell>
        <TableCell className="max-w-32 ">
          <p className="text-wrap">{tag.description}</p>
        </TableCell>
        <TableCell>
          <div className="flex flex-row gap-3">
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setOpenDelete(true)}
            >
              <Trash2 />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setOpenEdit(true)}
            >
              <Pencil />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

export default memo(TagTableRow);
