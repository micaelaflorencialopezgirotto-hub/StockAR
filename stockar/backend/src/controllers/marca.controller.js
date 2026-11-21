import { createController } from './crud.controller.js';
import marcaModel from '../models/marca.model.js';
import productoModel from '../models/producto.model.js';

export const marcaController = createController(marcaModel, {
  notFoundMessage: 'Marca no encontrada',
  required: ['nombre'],
  unique: [['nombre']],
  usedBy: [
    { model: productoModel, field: 'marca_id', label: ['producto', 'productos'] },
  ],
});

export default marcaController;
