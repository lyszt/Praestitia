import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

  ],

  server: {
    // NÃO MUDAR!
    port: 5173,
  },

  build: {
    minify: "esbuild",
    chunkSizeWarningLimit: 600,
  },

  optimizeDeps: {
    rolldownOptions: {},
  },

  ssr: {
    optimizeDeps: {
      rolldownOptions: {},
    },
  },

});
