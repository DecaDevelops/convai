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

export async function updateInterferenceProfile({
  profileId,
  req,
}: {
  profileId: string;
  req: InterferenceProfileRequest;
}) {
  const [profile] = await db
    .select()
    .from(InterferenceProfile)
    .where(eq(InterferenceProfile.id, profileId))
    .limit(1);

  if (!profile) throw new Error("Could not find request resource");

  await db
    .update(InterferenceProfile)
    .set(InterferenceProfileFactory.Update(profile, req))
    .where(eq(InterferenceProfile.id, profileId));

  return true;
}
