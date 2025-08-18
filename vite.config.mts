import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022", // Add this
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  esbuild: {
    target: "es2022",
    jsx: "automatic",
    loader: "tsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
});
