import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Las URLs y el puerto salen de .env.development / .env.production (y .env.local para overrides).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const host = env.STOCKAR_HOST || 'stockar';
  const port = Number(env.STOCKAR_PORT) || 5173;
  const apiProxy = env.STOCKAR_API_PROXY || 'http://localhost:3000';

  // Mismo servidor para `vite` (dev) y `vite preview`. Ambos sirven index.html en cualquier
  // ruta, así que el acceso directo a /productos, /proveedores, etc. funciona con React Router.
  const server = {
    // IPv4 local: el archivo hosts apunta stockar a 127.0.0.1 y pf redirige 127.0.0.1:80 a este puerto.
    host: '127.0.0.1',
    port,
    strictPort: true, // si el puerto está ocupado, falla en vez de cambiar de puerto en silencio
    allowedHosts: [host], // Vite rechaza nombres de host desconocidos; localhost siempre está permitido
    proxy: {
      '/api': {
        target: apiProxy,
        changeOrigin: true,
      },
    },
  };

  return {
    plugins: [react(), tailwindcss()],
    server,
    preview: server,
  };
});
