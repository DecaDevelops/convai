import { characterSelect } from "../character-type";

type Character = Pick<
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
>;

export type CharacterImport = Character & { image: Blob[] };
