import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',   // ← ВОТ СЮДА
  server: {
    allowedHosts: [
      '.ngrok-free.dev',  // разрешает все поддомены ngrok-free.dev
      'localhost'
    ]
  }
})