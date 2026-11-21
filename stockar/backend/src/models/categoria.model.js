import { createModel } from './crud.model.js';

export const categoriaModel = createModel({
  attributes: ['nombre', 'categoria_padre_id'],
  defaults: { categoria_padre_id: null },
  seed: [
    {
      id: 'categoria-01',
      nombre: 'Tornillería y fijaciones',
      categoria_padre_id: null,
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
    {
      id: 'categoria-02',
      nombre: 'Abrasivos',
      categoria_padre_id: null,
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default categoriaModel;
