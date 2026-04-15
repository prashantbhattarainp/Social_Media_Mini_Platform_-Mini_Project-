import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
    port: 8080,
    strictPort: true,
    },
  },
)};

// export default defineConfig({
//   const env = loadEnv(mode, process.cwd());
//   server: {
//     port: 8080,
//     strictPort: true,
//     proxy: {
//       "/api": {
//         target: "",
//         changeOrigin: true,
//       },
//     },
//   },
//   preview: {
//     port: 8080,
//     strictPort: true,
//   },
// });