import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["html-to-image", "jquery"], // Ensure html-to-image and jquery are pre-bundled
    // If the issue persists, try excluding them to see if direct browser import works
    // exclude: ['html-to-image', 'jquery']
  },
});
