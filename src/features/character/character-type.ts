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

type CharacterExport = Pick<
  characterSelect,
  | "id"
  | "description"
  | "name"
  | "greeting"
  | "exampleDialogue"
  | "instructions"
  | "personality"
  | "scenario"
  | "tags"
  | "updatedAt"
  | "createdAt"
>;

export type CharacterStore = CharacterExport & { image: Blob[] };
export type CharacterImport = CharacterExport & { image: string[] };
