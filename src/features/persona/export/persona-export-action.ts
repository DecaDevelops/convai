"use server";

import db from "@/data/db";
import { Persona } from "@/data/schema";
import ConvertToJson from "@/lib/json-func";
import { eq } from "drizzle-orm";
import { PersonaFactory } from "../persona-factory";

export async function exportPersonas() {
  const personas = await db.query.Persona.findMany();
  if (personas.length === 0) throw new Error("no personas to export");

  return ConvertToJson(personas);
}

export async function exportPersona(id: string) {
  const [persona] = await db.select().from(Persona).where(eq(Persona.id, id));
  if (!persona) throw new Error("persona not found");

  return ConvertToJson(await PersonaFactory.CreateExport(persona));
}
