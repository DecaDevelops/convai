"use server";

import db from "@/data/db";
import { TagRequest } from "./tag-types";
import { TagFactory } from "./tag-factory";
import { Tag } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function getTags() {
  return await db.query.Tag.findMany();
}

export async function createTag(req: TagRequest) {
  await db.insert(Tag).values(TagFactory.Create(req));
}

export async function deleteTag(tagId: number) {
  await db.delete(Tag).where(eq(Tag.id, tagId));
}

export async function updateTag({
  tagId,
  req,
}: {
  tagId: number;
  req: TagRequest;
}) {
  const [tag] = await db.select().from(Tag).where(eq(Tag.id, tagId)).limit(1);
  if (!tag) throw new Error("Tag not found");

  await db
    .update(Tag)
    .set(TagFactory.Update(tag, req))
    .where(eq(Tag.id, tagId));
}
