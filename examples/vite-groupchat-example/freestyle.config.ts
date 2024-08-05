import { defineConfig } from "freestyle-sh";

export default defineConfig({
  dev: {
    proxy: "http://localhost:5173",
    command: "vite",
  },
  deploy: {
    web: {
      entryPoint: "serve.ts",
    },
  },
});
