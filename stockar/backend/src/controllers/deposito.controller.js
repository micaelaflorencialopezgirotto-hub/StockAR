import { createController } from './crud.controller.js';
import depositoModel from '../models/deposito.model.js';

export const depositoController = createController(depositoModel, {
  notFoundMessage: 'Depósito no encontrado',
  required: ['nombre'],
});

export default depositoController;
