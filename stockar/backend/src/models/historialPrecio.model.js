import { createModel } from './crud.model.js';

export const historialPrecioModel = createModel({
  attributes: ['producto_proveedor_id', 'lista_precios_id', 'precio', 'vigente_desde'],
  defaults: { lista_precios_id: null },
  seed: [
    {
      id: 'historial-precio-demo',
      producto_proveedor_id: 'producto-proveedor-demo',
      lista_precios_id: 'lista-precios-demo',
      precio: 140,
      vigente_desde: '2026-11-21',
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default historialPrecioModel;
