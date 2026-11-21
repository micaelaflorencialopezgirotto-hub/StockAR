import { createController } from './crud.controller.js';
import ordenCompraItemModel from '../models/ordenCompraItem.model.js';
import ordenCompraModel from '../models/ordenCompra.model.js';
import productoModel from '../models/producto.model.js';

export const ordenCompraItemController = createController(ordenCompraItemModel, {
  notFoundMessage: 'Ítem de orden de compra no encontrado',
  required: ['orden_compra_id', 'producto_id', 'cantidad'],
  references: { orden_compra_id: ordenCompraModel, producto_id: productoModel },
  validate: (item) =>
    typeof item.cantidad !== 'number' || item.cantidad <= 0 ? 'La cantidad debe ser un número mayor a 0' : null,
});

export default ordenCompraItemController;
