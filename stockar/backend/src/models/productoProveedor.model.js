import { createModel } from './crud.model.js';

export const productoProveedorModel = createModel({
  attributes: [
    'producto_id',
    'proveedor_id',
    'codigo_proveedor',
    'descripcion_proveedor',
    'precio_lista',
    'moneda',
    'descuento_pct_propio',
    'stock_proveedor',
    'precio_actualizado_en',
    'activo',
  ],
  defaults: {
    moneda: 'ARS',
    descuento_pct_propio: null,
    stock_proveedor: null,
    precio_actualizado_en: () => new Date().toISOString(),
    activo: true,
  },
});

export default productoProveedorModel;
