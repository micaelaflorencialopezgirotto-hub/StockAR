import { createModel } from './crud.model.js';

export const marcaModel = createModel({
  attributes: ['nombre'],
  seed: [
    {
      id: 'marca-01',
      nombre: 'Genérica',
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default marcaModel;
