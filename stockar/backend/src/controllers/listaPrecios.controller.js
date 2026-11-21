import { createController } from './crud.controller.js';
import listaPreciosModel, { FORMATOS_LISTA, ESTADOS_LISTA } from '../models/listaPrecios.model.js';
import proveedorModel from '../models/proveedor.model.js';
import usuarioModel from '../models/usuario.model.js';
import historialPrecioModel from '../models/historialPrecio.model.js';
import listaPreciosItemModel from '../models/listaPreciosItem.model.js';

export const listaPreciosController = createController(listaPreciosModel, {
  notFoundMessage: 'Lista de precios no encontrada',
  required: ['proveedor_id', 'archivo_nombre', 'formato'],
  enums: { formato: FORMATOS_LISTA, estado: ESTADOS_LISTA },
  references: { proveedor_id: proveedorModel, usuario_id: usuarioModel },
  usedBy: [
    { model: historialPrecioModel, field: 'lista_precios_id', label: ['registro de historial de precio', 'registros de historial de precio'] },
    { model: listaPreciosItemModel, field: 'lista_precios_id', label: ['ítem de lista de precios', 'ítems de lista de precios'] },
  ],
});

export default listaPreciosController;
