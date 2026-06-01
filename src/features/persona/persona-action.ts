"use server";

import db from "@/data/db";
import { FormDataConverter } from "@/lib/form-data";
import { PersonaRequest } from "./persona-types";
import { PersonaFactory } from "./persona-factory";
import { deleteFile, transferFile } from "../image/transfer";
import { ImageFactory } from "../image/ImageFactory";
import { Persona } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function getPersonas() {
  return await db.query.Persona.findMany();
}

export async function createPersona(formData: FormData) {
  const data = FormDataConverter.fromFormData(formData);
  const upload = FormDataConverter.getFiles(formData, "uploads")?.[0] || null;
  const request: PersonaRequest = {
    name: (data.name as string) || "",
    description: data.description as string,
    uploads: null,
  };
  const persona = PersonaFactory.Create(request);

  const fileName = await transferFile(
    await ImageFactory.Create(upload),
    "personas",
  );

  persona.image = fileName;
  await db.insert(Persona).values(persona);

  return true;
}

export async function deletePersona(personaId: string) {
  const [persona] = await db
    .delete(Persona)
    .where(eq(Persona.id, personaId))
    .returning();

  const image = persona?.image;
  if (image) {
    await deleteFile(image);
  }
  return true;
}
