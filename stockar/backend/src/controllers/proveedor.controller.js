import { createController } from './crud.controller.js';
import proveedorModel, { MONEDAS, ESTADOS_PROVEEDOR } from '../models/proveedor.model.js';
import productoModel from '../models/producto.model.js';
import productoProveedorModel from '../models/productoProveedor.model.js';
import listaPreciosModel from '../models/listaPrecios.model.js';
import ordenCompraModel from '../models/ordenCompra.model.js';

export const proveedorController = createController(proveedorModel, {
  notFoundMessage: 'Proveedor no encontrado',
  required: ['razon_social'],
  enums: { moneda_lista: MONEDAS, estado: ESTADOS_PROVEEDOR },
  usedBy: [
    { model: productoModel, field: 'proveedor_principal_id', label: ['producto', 'productos'] },
    { model: productoProveedorModel, field: 'proveedor_id', label: ['relación producto-proveedor', 'relaciones producto-proveedor'] },
    { model: listaPreciosModel, field: 'proveedor_id', label: ['lista de precios', 'listas de precios'] },
    { model: ordenCompraModel, field: 'proveedor_id', label: ['orden de compra', 'órdenes de compra'] },
  ],
});

export default proveedorController;
