/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom resolver for figma assets
function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],

  // ⭐ DEV SERVER SETTINGS
  server: {
    port: 5173,
    open: "msedge", // ✅ ALWAYS OPEN IN MICROSOFT EDGE
  },

  // ⭐ TEST CONFIG
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./test-report",
    },
  },
});