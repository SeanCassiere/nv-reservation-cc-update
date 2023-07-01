import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

const commonPlugins = [react()];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: mode === "development" ? [...commonPlugins, eslintPlugin()] : [...commonPlugins],
  optimizeDeps: {
    esbuildOptions: {
      define: {},
      plugins: [],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
}));
