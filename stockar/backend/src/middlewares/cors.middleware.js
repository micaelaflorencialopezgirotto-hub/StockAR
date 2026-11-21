// CORS sin dependencias: permite solo los orígenes de CORS_ORIGINS (lista separada por comas).
// En desarrollo el frontend llama a /api por el proxy de Vite (mismo origen), así que esto aplica
// cuando el navegador llama directo al backend (por ejemplo, en producción con otro dominio).
const DEFAULT_ORIGINS = 'http://stockar,http://stockar:5173,http://localhost:5173';

const ALLOWED_METHODS = 'GET,POST,PATCH,PUT,DELETE,OPTIONS';
const ALLOWED_HEADERS = 'Content-Type,Authorization';

export function cors() {
  const allowed = new Set(
    (process.env.CORS_ORIGINS ?? DEFAULT_ORIGINS)
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean),
  );

  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowed.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS);
      res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);
      res.setHeader('Access-Control-Max-Age', '600');
    }
    res.setHeader('Vary', 'Origin');

    // Preflight: se responde acá sin pasar por las rutas.
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  };
}

export default cors;
