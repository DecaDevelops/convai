"use client";
import useTags from "@/features/tag/tag-context";
import TagForm from "@/features/tag/tag-form";
import React, { useState } from "react";
import TagCreateDialog from "./components/TagCreateDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TagTableRow from "./components/TagTableRow";
import useTagMutations from "@/features/tag/use-tag-mutations";

export default function Client() {
  const { tags, isLoadingTags } = useTags();

  const [open, setOpen] = useState(false);
  return (
    <>
      <TagCreateDialog open={open} setOpen={setOpen} />
      <div className="w-1/2 mx-auto my-5">
        <div className="w-fit ml-auto">
          <Button variant={"outline"} onClick={() => setOpen(true)}>
            <Plus /> <span>Create Tag</span>
          </Button>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl py-2">Tags</h1>
          <Table>
            <TableCaption>Tags created/imported by you</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((x) => (
                <TagTableRow key={x.id} tag={x} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
