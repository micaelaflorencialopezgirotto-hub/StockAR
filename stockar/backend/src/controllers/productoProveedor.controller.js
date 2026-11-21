import { createController } from './crud.controller.js';
import productoProveedorModel from '../models/productoProveedor.model.js';
import productoModel from '../models/producto.model.js';
import proveedorModel, { MONEDAS } from '../models/proveedor.model.js';
import historialPrecioModel from '../models/historialPrecio.model.js';
import listaPreciosItemModel from '../models/listaPreciosItem.model.js';

export const productoProveedorController = createController(productoProveedorModel, {
  notFoundMessage: 'Relación producto-proveedor no encontrada',
  required: ['producto_id', 'proveedor_id', 'codigo_proveedor'],
  enums: { moneda: MONEDAS },
  references: { producto_id: productoModel, proveedor_id: proveedorModel },
  unique: [['proveedor_id', 'codigo_proveedor']],
  usedBy: [
    { model: historialPrecioModel, field: 'producto_proveedor_id', label: ['registro de historial de precio', 'registros de historial de precio'] },
    { model: listaPreciosItemModel, field: 'producto_proveedor_id', label: ['ítem de lista de precios', 'ítems de lista de precios'] },
  ],
});

export default productoProveedorController;
