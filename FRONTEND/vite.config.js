import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  preview: {
    port: process.env.PORT || 4173, // Render sets the PORT automatically
    host: true,                      // Listen on all network interfaces
    allowedHosts: [
      "real-view-estate-frontend.onrender.com" // Whitelist your deployed frontend
    ],
  },
});
