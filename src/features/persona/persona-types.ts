import { Persona } from "@/data/schema";

export type PersonaSelect = typeof Persona.$inferSelect;
export type PersonaInsert = typeof Persona.$inferInsert;
export type PersonaRequest = Pick<PersonaInsert, "name" | "description">;
