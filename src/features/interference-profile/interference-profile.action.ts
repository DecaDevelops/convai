"use server";

import db from "@/data/db";
import { InterferenceProfileRequest } from "./interference-profile-types";
import { InterferenceProfile } from "@/data/schema";
import { InterferenceProfileFactory } from "./interference-profile-factory";
import { eq } from "drizzle-orm";

export async function getInterferenceProfiles() {
  return await db.query.InterferenceProfile.findMany();
}

export async function createInterferenceProfile(
  req: InterferenceProfileRequest,
) {
  await db
    .insert(InterferenceProfile)
    .values(InterferenceProfileFactory.Create(req));
  return true;
}

export async function deleteInterferenceProfile(interferenceProfileId: string) {
  await db
    .delete(InterferenceProfile)
    .where(eq(InterferenceProfile.id, interferenceProfileId));
  return true;
}
