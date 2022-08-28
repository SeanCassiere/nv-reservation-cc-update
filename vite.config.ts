import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

const commonPlugins = [react()];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: mode === "development" ? [...commonPlugins, eslintPlugin()] : [],
  optimizeDeps: {
    esbuildOptions: {
      define: {},
      plugins: [],
    },
  },
  resolve: {
    alias: {},
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
}));
