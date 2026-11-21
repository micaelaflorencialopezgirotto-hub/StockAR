import express from 'express';
import indexRoutes from './routes/index.routes.js';
import productoRoutes from './routes/producto.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import marcaRoutes from './routes/marca.routes.js';
import depositoRoutes from './routes/deposito.routes.js';
import proveedorRoutes from './routes/proveedor.routes.js';
import productoProveedorRoutes from './routes/productoProveedor.routes.js';
import historialPrecioRoutes from './routes/historialPrecio.routes.js';
import listaPreciosRoutes from './routes/listaPrecios.routes.js';
import listaPreciosItemRoutes from './routes/listaPreciosItem.routes.js';
import movimientoRoutes from './routes/movimiento.routes.js';
import ordenCompraRoutes from './routes/ordenCompra.routes.js';
import ordenCompraItemRoutes from './routes/ordenCompraItem.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import configuracionRoutes from './routes/configuracion.routes.js';

const app = express();

app.use(express.json());

app.use('/api', indexRoutes);
app.use('/api/products', productoRoutes);
app.use('/api/categories', categoriaRoutes);
app.use('/api/brands', marcaRoutes);
app.use('/api/warehouses', depositoRoutes);
app.use('/api/suppliers', proveedorRoutes);
app.use('/api/product-suppliers', productoProveedorRoutes);
app.use('/api/price-history', historialPrecioRoutes);
app.use('/api/price-lists', listaPreciosRoutes);
app.use('/api/price-list-items', listaPreciosItemRoutes);
app.use('/api/movements', movimientoRoutes);
app.use('/api/purchase-orders', ordenCompraRoutes);
app.use('/api/purchase-order-items', ordenCompraItemRoutes);
app.use('/api/users', usuarioRoutes);
app.use('/api/settings', configuracionRoutes);

// Rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ status: 404, data: { message: 'Ruta no encontrada' } });
});

// Manejo de errores (JSON mal formado, errores no capturados, etc.)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 400, data: { message: 'El cuerpo de la solicitud no es un JSON válido' } });
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  const message = status >= 500 ? 'Error interno del servidor' : err.expose ? err.message : 'Solicitud inválida';
  return res.status(status).json({ status, data: { message } });
});

export default app;
