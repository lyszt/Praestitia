import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";
import { visualizer } from "rollup-plugin-visualizer";
import { terser } from "rollup-plugin-terser";

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),

    // Static asset compression (generates .gz files)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // only compress files > 10kb
      deleteOriginFile: false,
    }),

    // Image optimization for production builds
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      mozjpeg: {
        quality: 75,
      },
      pngquant: {
        quality: [0.7, 0.9],
        speed: 3,
      },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "removeEmptyAttrs", active: false },
        ],
      },
    }),
  ],

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
