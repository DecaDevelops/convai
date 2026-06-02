"use client";

import { useState } from "react";
import { TagRequest } from "./tag-types";
import { InputWithLabel } from "@/components/input-with-label";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import { Button } from "@/components/ui/button";
import { CircleFadingPlus, TagsIcon } from "lucide-react";
const DEFAULT: TagRequest = {
  name: "",
  description: "",
};
export default function TagForm({
  _tag,
  isPending,
  onSubmit,
}: {
  onSubmit: (req: TagRequest) => void;
  _tag?: TagRequest;
  isPending: boolean;
}) {
  const [tag, setTag] = useState(_tag ?? DEFAULT);
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (isPending) return;

        return onSubmit(tag);
      }}
    >
      <InputWithLabel
        label="Name"
        value={tag.name}
        onChange={(e) => setTag((c) => ({ ...c, name: e.target.value }))}
      />
      <TextAreaWithLabel
        label="Description"
        className="min-h-32 max-h-96 resize-none"
      />
      <div className="w-fit ml-auto">
        <Button className="">
          <CircleFadingPlus />
          Add Tag
        </Button>
      </div>
    </form>
  );
}
