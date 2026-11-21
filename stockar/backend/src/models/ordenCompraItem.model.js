import { createModel } from './crud.model.js';

export const ordenCompraItemModel = createModel({
  attributes: ['orden_compra_id', 'producto_id', 'cantidad', 'precio_unitario'],
  seed: [
    {
      id: 'orden-compra-item-demo',
      orden_compra_id: 'orden-compra-demo',
      producto_id: 'producto-01',
      cantidad: 100,
      precio_unitario: 140,
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default ordenCompraItemModel;
