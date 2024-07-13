import { defineConfig } from "freestyle-sh";
import { config } from "dotenv";

config();

export default defineConfig({
  dev: {
    command: "npx astro dev",
    proxy: "http://localhost:4321",
  },
});
