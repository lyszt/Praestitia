import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),

    // Static asset compression (generates .gz files)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, 
      deleteOriginFile: false,
    }),

  ],

  esbuild: {
    jsx: "preserve",
    jsxImportSource: "solid-js",
  },
  resolve: {
    alias: [
      { find: 'react/jsx-runtime', replacement: 'solid-js/jsx-runtime' },
      { find: 'react/jsx-dev-runtime', replacement: 'solid-js/jsx-dev-runtime' }
    ]
  },
  optimizeDeps: {
    include: ["solid-js", "solid-js/web"]
  },
  
  build: {
    minify: "terser",
    rollupOptions: {
      plugins: [
        terser({
          format: {
            comments: false,
          },
          compress: {
            passes: 2,
            drop_console: true,
            drop_debugger: true,
          },
          mangle: true,
        }),
      ],
    },

    chunkSizeWarningLimit: 600,
  },

});
