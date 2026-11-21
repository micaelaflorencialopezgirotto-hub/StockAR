import { createController } from './crud.controller.js';
import productoProveedorModel from '../models/productoProveedor.model.js';
import productoModel from '../models/producto.model.js';
import proveedorModel, { MONEDAS } from '../models/proveedor.model.js';

export const productoProveedorController = createController(productoProveedorModel, {
  notFoundMessage: 'Relación producto-proveedor no encontrada',
  required: ['producto_id', 'proveedor_id', 'codigo_proveedor'],
  enums: { moneda: MONEDAS },
  references: { producto_id: productoModel, proveedor_id: proveedorModel },
  unique: [['proveedor_id', 'codigo_proveedor']],
});

export default productoProveedorController;
