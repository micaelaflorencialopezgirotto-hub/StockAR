import { createController } from './crud.controller.js';
import listaPreciosItemModel, { TIPOS_CAMBIO } from '../models/listaPreciosItem.model.js';
import listaPreciosModel from '../models/listaPrecios.model.js';
import productoProveedorModel from '../models/productoProveedor.model.js';
import productoModel from '../models/producto.model.js';

export const listaPreciosItemController = createController(listaPreciosItemModel, {
  notFoundMessage: 'Ítem de lista de precios no encontrado',
  required: ['lista_precios_id', 'nro_fila', 'tipo_cambio'],
  enums: { tipo_cambio: TIPOS_CAMBIO },
  references: {
    lista_precios_id: listaPreciosModel,
    producto_proveedor_id: productoProveedorModel,
    producto_sugerido_id: productoModel,
  },
});

export default listaPreciosItemController;
