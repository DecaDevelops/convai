import { Tag } from "@/data/schema";

export type TagSelect = typeof Tag.$inferSelect;
export type TagInsert = typeof Tag.$inferInsert;
export type TagRequest = Pick<TagInsert, "name" | "description">;
