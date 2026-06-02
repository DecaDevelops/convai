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

export async function getPersona(id: string) {
  const [persona] = await db
    .select()
    .from(Persona)
    .where(eq(Persona.id, id))
    .limit(1);

  return persona ?? null;
}

export async function createPersona(formData: FormData) {
  const data = FormDataConverter.fromFormData(formData);
  const upload = formData.get("upload");
  const request: PersonaRequest = {
    name: (data.name as string) || "",
    description: data.description as string,
  };
  const persona = PersonaFactory.Create(request);

  if (upload instanceof File) {
    const fileName = await transferFile(
      await ImageFactory.Create(upload),
      "personas",
    );
    persona.image = fileName;
  }

  await db.insert(Persona).values(persona);

  return true;
}

export async function updatePersona({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const data = FormDataConverter.fromFormData(formData) as {
    [K in keyof PersonaRequest]: PersonaRequest[K];
  };
  const upload = formData.get("upload");
  const [persona] = await db
    .select()
    .from(Persona)
    .where(eq(Persona.id, id))
    .limit(1);

  if (!persona) throw new Error("Persona not found");

  const updatedPersona = PersonaFactory.Update(persona, data);
  if (upload instanceof File) {
    const fileName = await transferFile(
      await ImageFactory.Create(upload),
      "personas",
    );
    updatedPersona.image = fileName;
    if (persona.image) {
      await deleteFile(persona.image);
    }
  }
  await db.update(Persona).set(updatedPersona).where(eq(Persona.id, id));
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
