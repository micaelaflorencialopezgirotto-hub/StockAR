import { createModel } from './crud.model.js';

export const depositoModel = createModel({
  attributes: ['nombre', 'codigo', 'es_predeterminado'],
  defaults: { codigo: null, es_predeterminado: false },
  seed: [
    {
      id: 'deposito-01',
      nombre: 'Depósito central',
      codigo: 'DEP-01',
      es_predeterminado: true,
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default depositoModel;
