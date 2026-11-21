import { createController } from './crud.controller.js';
import usuarioModel, { ROLES } from '../models/usuario.model.js';

export const usuarioController = createController(usuarioModel, {
  notFoundMessage: 'Usuario no encontrado',
  required: ['nombre', 'email'],
  enums: { rol: ROLES },
});

export default usuarioController;
