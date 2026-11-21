import { createController } from './crud.controller.js';
import marcaModel from '../models/marca.model.js';

export const marcaController = createController(marcaModel, {
  notFoundMessage: 'Marca no encontrada',
  required: ['nombre'],
  unique: [['nombre']],
});

export default marcaController;
