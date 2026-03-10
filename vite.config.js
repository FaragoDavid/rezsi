import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  root: "src",
  base: mode === "production" ? "/rezsi/" : "/",
  publicDir: "../public",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  server: {
    port: 8000,
  },
}));
