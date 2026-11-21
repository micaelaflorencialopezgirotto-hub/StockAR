import { createController } from './crud.controller.js';
import categoriaModel from '../models/categoria.model.js';

export const categoriaController = createController(categoriaModel, {
  notFoundMessage: 'Categoría no encontrada',
  required: ['nombre'],
  references: { categoria_padre_id: categoriaModel },
  validate: (categoria, current) =>
    current && categoria.categoria_padre_id === current.id
      ? 'Una categoría no puede ser su propia categoría padre'
      : null,
});

export default categoriaController;
