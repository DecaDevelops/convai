import { ApiKey } from "@/data/schema";

export type ApiKeysSelect = typeof ApiKey.$inferSelect;
export type ApiKeysInsert = typeof ApiKey.$inferInsert;
export type ApiKeyRequest = Pick<
  ApiKeysInsert,
  "name" | "description" | "value"
>;
