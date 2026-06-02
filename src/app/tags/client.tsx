"use client";
import useTags from "@/features/tag/tag-context";
import TagForm from "@/features/tag/tag-form";
import React, { useState } from "react";

export default function Client() {
  const { tags, isLoadingTags } = useTags();
  const [openCreate, setOpenCreate] = useState(false);
  return (
    <div className="w-1/2 mx-auto my-5">
      <TagForm isPending={false} onSubmit={(req) => {}} />
    </div>
  );
}
