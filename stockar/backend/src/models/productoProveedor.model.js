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
  seed: [
    {
      id: 'producto-proveedor-demo',
      producto_id: 'producto-01',
      proveedor_id: 'proveedor-demo',
      codigo_proveedor: 'DD-TH10',
      descripcion_proveedor: 'Tornillo hex. 10mm galv. x unidad',
      precio_lista: 140,
      moneda: 'ARS',
      descuento_pct_propio: null,
      stock_proveedor: 5000,
      precio_actualizado_en: '2026-11-21T12:00:00.000Z',
      activo: true,
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default productoProveedorModel;
