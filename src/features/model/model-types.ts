import { Model } from "@/data/schema";

export type ModelSelect = typeof Model.$inferSelect;
export type ModelInsert = typeof Model.$inferInsert;
export type ModelRequest = Pick<
  ModelInsert,
  | "name"
  | "providerId"
  | "providerModelName"
  | "contextSize"
  | "maxTokenResponse"
  | "description"
  | "tags"
>;
