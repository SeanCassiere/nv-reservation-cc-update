import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";

import packageJson from "./package.json";

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
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
}));
