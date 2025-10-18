import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    host: true, // optional, para ma-access sa LAN
    port: 3000,
    allowedHosts: [
      'pace-app-frontend.onrender.com',
    ]
  },
})
