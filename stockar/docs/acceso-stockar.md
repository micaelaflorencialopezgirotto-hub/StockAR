# Acceder a StockAR en http://stockar

En desarrollo, StockAR se abre en `http://stockar/` en lugar de `http://localhost:5173`.

> **Con la redirección activa, el puerto 5173 no responde directo**: `http://localhost:5173` y `http://stockar:5173` se quedan colgados (efecto de la regla de pf sobre su puerto destino). Usá `http://stockar/`, que incluye la recarga automática (HMR). Para volver a `localhost:5173`, corré `sh scripts/dominio-local.sh desactivar`.

## Cómo funciona

```
navegador → http://stockar/                (hosts: stockar = 127.0.0.1)
         → 127.0.0.1:80                    (pf redirige el 80 al puerto de Vite)
         → Vite en 127.0.0.1:5173          (acepta el host "stockar")
             /api/* → backend en :3000     (proxy de Vite, mismo origen: sin CORS)
             otras rutas → index.html      (React Router: /productos, /proveedores, etc.)
```

macOS no deja abrir el puerto 80 sin permisos de administrador. Por eso Vite sigue en 5173 y el firewall de macOS (pf) redirige el 80 hacia ese puerto.

## Configuración (una vez, y la redirección después de cada reinicio)

Desde la carpeta `stockar/`, en una terminal:

```sh
sh scripts/dominio-local.sh activar
```

Pide la contraseña de administrador y hace dos cambios:

1. **Archivo hosts** (`/etc/hosts`): agrega la línea

   ```
   127.0.0.1 stockar
   ```

   y limpia la caché de DNS.
2. **pf**: carga la regla `rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port 5173` en un anchor propio (`com.apple/stockar`), sin tocar `/etc/pf.conf`.

La línea de hosts queda guardada. La regla de pf se pierde al reiniciar la Mac: volvé a correr `activar`.

Para deshacer todo: `sh scripts/dominio-local.sh desactivar`. Para ver cómo quedó: `sh scripts/dominio-local.sh estado`.

Si preferís no usar pf (o lo desactivaste), con solo la línea de hosts podés entrar en `http://stockar:5173/`, y `http://localhost:5173` vuelve a andar.

## Arrancar StockAR

```sh
# Terminal 1
cd stockar/backend && npm run dev

# Terminal 2
cd stockar/frontend && npm run dev
```

Abrí **`http://stockar/`**, escribiendo `http://` y la barra final: si escribís solo `stockar`, el navegador lo busca en Google.

## Variables de entorno

| Dónde | Variable | Para qué | Valor en desarrollo |
|---|---|---|---|
| `frontend/.env.development` | `STOCKAR_HOST` | Nombre de host que acepta Vite | `stockar` |
| | `STOCKAR_PORT` | Puerto de Vite (dev y preview) | `5173` |
| | `STOCKAR_API_PROXY` | Backend al que Vite reenvía `/api` | `http://localhost:3000` |
| | `VITE_API_URL` | Base de la API en el navegador (vacío = mismo origen) | vacío |
| `frontend/.env.production` | `VITE_API_URL` | Igual, para el build de producción | vacío |
| `backend/.env` | `PORT` | Puerto del backend | `3000` |
| | `CORS_ORIGINS` | Orígenes que pueden llamar a la API directo | `http://stockar,http://stockar:5173,http://localhost:5173` |

Para cambiar algo solo en tu máquina, creá `frontend/.env.local`: no se versiona y pisa a `.env.development`. Si cambiás `STOCKAR_PORT`, corré el script con el mismo puerto: `STOCKAR_PORT=5174 sh scripts/dominio-local.sh activar`.

## Producción

- `npm run build` genera `frontend/dist/`. El servidor que lo publique tiene que:
  - devolver `index.html` en cualquier ruta que no sea un archivo, para que funcione el acceso directo a `/productos`, `/proveedores`, etc.;
  - reenviar `/api` al backend, **o** definir `VITE_API_URL` con la URL de la API y agregar el dominio del frontend a `CORS_ORIGINS`.
- `npm run preview` sirve el build con la misma configuración de puerto y host que `npm run dev`.
