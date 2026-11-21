import { createModel } from './crud.model.js';

export const TIPOS_CAMBIO = ['sin_cambio', 'precio', 'nuevo', 'error'];

export const listaPreciosItemModel = createModel({
  attributes: [
    'lista_precios_id',
    'nro_fila',
    'codigo_proveedor',
    'descripcion',
    'precio_nuevo',
    'precio_anterior',
    'tipo_cambio',
    'producto_proveedor_id',
    'producto_sugerido_id',
    'mensaje_error',
    'resuelto',
  ],
  defaults: {
    precio_anterior: null,
    producto_proveedor_id: null,
    producto_sugerido_id: null,
    mensaje_error: null,
    resuelto: false,
  },
  seed: [
    {
      id: 'lista-precios-item-demo',
      lista_precios_id: 'lista-precios-demo',
      nro_fila: 1,
      codigo_proveedor: 'DD-TH10',
      descripcion: 'Tornillo hex. 10mm galv. x unidad',
      precio_nuevo: 140,
      precio_anterior: 130,
      tipo_cambio: 'precio',
      producto_proveedor_id: 'producto-proveedor-demo',
      producto_sugerido_id: null,
      mensaje_error: null,
      resuelto: false,
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default listaPreciosItemModel;
