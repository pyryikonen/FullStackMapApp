import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // Ensure assets are copied to the output folder
    assetsInlineLimit: 0,
    assetsDir: "assets",
    rollupOptions: {
      external: ["/assets/marker-icon-ITd9PylV.png"],
    },
    plugins: [react()],
  },
});
