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
});

export default listaPreciosItemModel;
