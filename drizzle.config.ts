import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./src/data/convai.sqlite.db",
  },
  schema: "./src/data/schema.ts",
});
