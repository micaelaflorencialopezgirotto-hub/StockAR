import { createController } from './crud.controller.js';
import listaPreciosModel, { FORMATOS_LISTA, ESTADOS_LISTA } from '../models/listaPrecios.model.js';
import proveedorModel from '../models/proveedor.model.js';
import usuarioModel from '../models/usuario.model.js';

export const listaPreciosController = createController(listaPreciosModel, {
  notFoundMessage: 'Lista de precios no encontrada',
  required: ['proveedor_id', 'archivo_nombre', 'formato'],
  enums: { formato: FORMATOS_LISTA, estado: ESTADOS_LISTA },
  references: { proveedor_id: proveedorModel, usuario_id: usuarioModel },
});

export default listaPreciosController;
