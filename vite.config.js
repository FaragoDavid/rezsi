import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/rezsi/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  server: {
    port: 8000,
  },
});
