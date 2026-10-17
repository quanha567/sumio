import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@sumio/contract": path.resolve(import.meta.dirname, "../packages/contract/src"),
      "@sumio/common": path.resolve(import.meta.dirname, "../packages/common/src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }

          if (id.includes("node_modules/@heroui/") || id.includes("node_modules/@react-aria/")) {
            return "vendor-heroui";
          }

          if (id.includes("node_modules/@tanstack/")) {
            return "vendor-router";
          }

          if (id.includes("node_modules/recharts/") || id.includes("node_modules/d3-")) {
            return "vendor-charts";
          }

          if (id.includes("node_modules/firebase/") || id.includes("node_modules/@firebase/")) {
            return "vendor-firebase";
          }
        },
      },
    },
  },
  fmt: {
    ignorePatterns: ["dist/**", "src/routeTree.gen.ts"],
  },
  lint: {
    ignorePatterns: ["dist/**", "src/routeTree.gen.ts"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
