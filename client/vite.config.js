import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 8080,
      strictPort: true,
    },
  });
};