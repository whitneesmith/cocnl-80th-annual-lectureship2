import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Production configuration for deployment
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: true,
  },
  base: "./",
});