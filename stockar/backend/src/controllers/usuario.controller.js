import { createController } from './crud.controller.js';
import usuarioModel, { ROLES } from '../models/usuario.model.js';
import movimientoModel from '../models/movimiento.model.js';
import listaPreciosModel from '../models/listaPrecios.model.js';
import ordenCompraModel from '../models/ordenCompra.model.js';

export const usuarioController = createController(usuarioModel, {
  notFoundMessage: 'Usuario no encontrado',
  required: ['nombre', 'email'],
  enums: { rol: ROLES },
  usedBy: [
    { model: movimientoModel, field: 'usuario_id', label: ['movimiento', 'movimientos'] },
    { model: listaPreciosModel, field: 'usuario_id', label: ['lista de precios', 'listas de precios'] },
    { model: ordenCompraModel, field: 'creada_por', label: ['orden de compra', 'órdenes de compra'] },
  ],
});

export default usuarioController;
