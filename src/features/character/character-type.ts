import { Character } from "@/data/schema";

export type characterSelect = typeof Character.$inferSelect;

export type characterInsert = typeof Character.$inferInsert;

export type characterRequest = Pick<
  characterInsert,
  | "name"
  | "description"
  | "greeting"
  | "personality"
  | "scenario"
  | "exampleDialogue"
  | "instructions"
  | "tags"
>;

export type CharacterImport = Pick<
  characterSelect,
  | "id"
  | "name"
  | "description"
  | "greeting"
  | "personality"
  | "scenario"
  | "exampleDialogue"
  | "instructions"
  | "tags"
  | "createdAt"
  | "updatedAt"
> & { image: Blob[] };
