import { createController } from './crud.controller.js';
import ordenCompraModel, { ESTADOS_ORDEN } from '../models/ordenCompra.model.js';
import proveedorModel from '../models/proveedor.model.js';
import usuarioModel from '../models/usuario.model.js';
import ordenCompraItemModel from '../models/ordenCompraItem.model.js';
import movimientoModel from '../models/movimiento.model.js';

export const ordenCompraController = createController(ordenCompraModel, {
  notFoundMessage: 'Orden de compra no encontrada',
  required: ['numero', 'proveedor_id'],
  enums: { estado: ESTADOS_ORDEN },
  references: { proveedor_id: proveedorModel, creada_por: usuarioModel },
  unique: [['numero']],
  usedBy: [
    { model: ordenCompraItemModel, field: 'orden_compra_id', label: ['ítem de orden de compra', 'ítems de orden de compra'] },
    { model: movimientoModel, field: 'orden_compra_id', label: ['movimiento', 'movimientos'] },
  ],
});

export default ordenCompraController;
