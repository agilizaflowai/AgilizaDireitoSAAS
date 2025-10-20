import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/webhook': {
        target: 'https://n8n-n8n.04qisd.easypanel.host',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/webhook/, '/webhook/juridico/analise-de-contratos')
      },
      '/api/processos': {
        target: 'https://n8n-n8n.04qisd.easypanel.host',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/processos/, '/webhook/juridico/analise-de-processos')
      }
    }
  },
  build: { outDir: 'docs' }
});
