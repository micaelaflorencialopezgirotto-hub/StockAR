import { createController } from './crud.controller.js';
import depositoModel from '../models/deposito.model.js';
import productoModel from '../models/producto.model.js';
import movimientoModel from '../models/movimiento.model.js';

export const depositoController = createController(depositoModel, {
  notFoundMessage: 'Depósito no encontrado',
  required: ['nombre'],
  usedBy: [
    { model: productoModel, field: 'deposito_id', label: ['producto', 'productos'] },
    { model: movimientoModel, field: 'deposito_id', label: ['movimiento', 'movimientos'] },
  ],
});

export default depositoController;
