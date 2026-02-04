import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "src/renderer",
  plugins: [react()],
  server: {
    port: 1212,
  },
  build: {
    outDir: "../../dist",
  },
});
