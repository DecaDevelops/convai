import { InterferenceProfile } from "@/data/schema";

export type InterferenceProfileSelect = typeof InterferenceProfile.$inferSelect;
export type InterferenceProfileInsert = typeof InterferenceProfile.$inferInsert;
export type InterferenceProfileRequest = Pick<
  InterferenceProfileInsert,
  | "name"
  | "description"
  | "maxResponseTokens"
  | "modelId"
  | "temperature"
  | "topK"
  | "topP"
>;
