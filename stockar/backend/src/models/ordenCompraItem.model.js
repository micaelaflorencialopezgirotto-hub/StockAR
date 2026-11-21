import { createModel } from './crud.model.js';

export const ordenCompraItemModel = createModel({
  attributes: ['orden_compra_id', 'producto_id', 'cantidad', 'precio_unitario'],
});

export default ordenCompraItemModel;
