import { Provider } from "@/data/schema";

export type ProviderSelect = typeof Provider.$inferSelect;
export type ProviderInsert = typeof Provider.$inferInsert;
export type ProviderRequest = Pick<
  ProviderInsert,
  "name" | "path" | "apiKeyId" | "description"
>;
