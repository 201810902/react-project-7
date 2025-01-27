import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { env } from "node:process";

const idDev = env.NODE_ENV === "development";

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
    modules: {
      generateScopedName: idDev
        ? "[name]_[local]__[hash:base64:5]"
        : "[hash:base64:4]",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});