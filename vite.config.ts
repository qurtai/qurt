import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: "electron/main.ts",
        vite: {
          build: {
            rollupOptions: {
              external: ["electron", "electron-store"],
            },
          },
        },
      },
      preload: {
        input: "electron/preload.ts",
      },
    }),
  ],
  resolve: {
    alias: {
      "@/App": path.resolve(__dirname, "src/App.tsx"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/stores": path.resolve(__dirname, "src/stores"),
      "@/templates": path.resolve(__dirname, "templates"),
      "@/constants": path.resolve(__dirname, "src/constants"),
      "@/mocks": path.resolve(__dirname, "src/mocks"),
      "@/utils": path.resolve(__dirname, "utils"),
    },
  },
});
