import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl' // Import it
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: false, // Allows access via IP
  }
})
