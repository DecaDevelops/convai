"use server";

import db from "@/data/db";
import { ApiKeyRequest } from "./api-keys-types";
import { ApiKey } from "@/data/schema";
import { ApiKeysFactory as ApiKeyFactory } from "./api-keys-factory";
import { eq } from "drizzle-orm";

export async function createApiKey(req: ApiKeyRequest) {
  await db.insert(ApiKey).values(ApiKeyFactory.Create(req));
  return true;
}

export async function getApiKeys() {
  return await db.select().from(ApiKey);
}

export async function deleteApiKey(apiKeyId: string) {
  await db.delete(ApiKey).where(eq(ApiKey.id, apiKeyId));
  return true;
}

export async function updateApiKey({
  apiKeyId,
  req,
}: {
  apiKeyId: string;
  req: ApiKeyRequest;
}) {
  const [apiKey] = await db
    .select()
    .from(ApiKey)
    .where(eq(ApiKey.id, apiKeyId))
    .limit(1);
  if (!apiKey) throw new Error("Api key not found");

  await db
    .update(ApiKey)
    .set(ApiKeyFactory.Update(apiKey, req))
    .where(eq(ApiKey.id, apiKeyId));

  return true;
}
