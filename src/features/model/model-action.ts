"use server";

import db from "@/data/db";
import { ModelRequest } from "./model-types";
import { Model } from "@/data/schema";
import { ModelFactory } from "./model-factory";
import { eq } from "drizzle-orm";

export async function getModels() {
  return await db.query.Model.findMany();
}

export async function createModel(req: ModelRequest) {
  await db.insert(Model).values(ModelFactory.Create(req));
  return true;
}

export async function deleteModel(modelId: string) {
  await db.delete(Model).where(eq(Model.id, modelId));
  return true;
}
