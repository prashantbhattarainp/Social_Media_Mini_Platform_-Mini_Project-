import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
});