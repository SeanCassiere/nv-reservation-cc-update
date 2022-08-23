import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: mode === "development" ? [react(), eslintPlugin()] : [],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        GlobalPolyFill({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      util: "util",
      web3: "web3/dist/web3.min.js",
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
}));
