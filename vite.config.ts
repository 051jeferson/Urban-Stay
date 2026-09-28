import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: ['index.html', 'empresa.html', 'atuacao.html', 'destino.html', 'contato.html', 'privacidade.html', 'cookies.html', 'termos-de-uso.html'],
    },
  },
  server: { port: 5173, open: false },
})
