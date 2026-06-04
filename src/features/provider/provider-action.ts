"use server";

import db from "@/data/db";
import { ProviderRequest } from "./provider-types";
import { Provider } from "@/data/schema";
import { ProviderFactory } from "./provider-factory";
import { eq } from "drizzle-orm";

export async function getProviders() {
  return await db.query.Provider.findMany();
}

export async function deleteProvider(providerId: string) {
  await db.delete(Provider).where(eq(Provider.id, providerId));
  return true;
}

export async function createProvider(req: ProviderRequest) {
  await db.insert(Provider).values(ProviderFactory.Create(req));
  return true;
}

export async function updateProvider({
  providerId,
  req,
}: {
  providerId: string;
  req: ProviderRequest;
}) {
  const [provider] = await db
    .select()
    .from(Provider)
    .where(eq(Provider.id, providerId))
    .limit(1);
  if (!provider) throw new Error("Provider not found");

  await db
    .update(Provider)
    .set(ProviderFactory.CreateUpdate(provider, req))
    .where(eq(Provider.id, providerId));
  return true;
}
