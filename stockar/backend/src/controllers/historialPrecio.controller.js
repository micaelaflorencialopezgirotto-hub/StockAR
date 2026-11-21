import { createController } from './crud.controller.js';
import historialPrecioModel from '../models/historialPrecio.model.js';
import productoProveedorModel from '../models/productoProveedor.model.js';
import listaPreciosModel from '../models/listaPrecios.model.js';

export const historialPrecioController = createController(historialPrecioModel, {
  notFoundMessage: 'Registro de historial de precio no encontrado',
  required: ['producto_proveedor_id', 'precio', 'vigente_desde'],
  references: {
    producto_proveedor_id: productoProveedorModel,
    lista_precios_id: listaPreciosModel,
  },
});

export default historialPrecioController;
