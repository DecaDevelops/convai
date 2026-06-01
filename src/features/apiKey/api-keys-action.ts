"use server";

import db from "@/data/db";
import { ApiKeyRequest } from "./api-keys-types";
import { ApiKey } from "@/data/schema";
import { ApiKeysFactory } from "./api-keys-factory";
import { eq } from "drizzle-orm";

export async function createApiKey(req: ApiKeyRequest) {
  await db.insert(ApiKey).values(ApiKeysFactory.Create(req));
  return true;
}

export async function getApiKeys() {
  return await db.select().from(ApiKey);
}

export async function deleteApiKey(apiKeyId: string) {
  await db.delete(ApiKey).where(eq(ApiKey.id, apiKeyId));
  return true;
}
