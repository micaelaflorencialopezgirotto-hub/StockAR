import { createModel } from './crud.model.js';

export const ROLES = ['dueña', 'jefe_deposito', 'vendedor'];

export const usuarioModel = createModel({
  attributes: ['nombre', 'email', 'rol', 'avatar', 'activo'],
  defaults: { rol: 'vendedor', avatar: null, activo: true },
  seed: [
    {
      id: 'usuario-01',
      nombre: 'Administrador',
      email: 'admin@stockar.local',
      rol: 'dueña',
      avatar: null,
      activo: true,
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default usuarioModel;
