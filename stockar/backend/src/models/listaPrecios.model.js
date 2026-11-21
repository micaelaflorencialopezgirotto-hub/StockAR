import { createModel } from './crud.model.js';

export const FORMATOS_LISTA = ['xlsx', 'csv'];
export const ESTADOS_LISTA = ['pendiente_revision', 'aplicada', 'descartada'];

export const listaPreciosModel = createModel({
  attributes: [
    'proveedor_id',
    'archivo_nombre',
    'formato',
    'fecha_vigencia',
    'importada_en',
    'usuario_id',
    'total_filas',
    'filas_nuevas',
    'filas_con_cambio',
    'filas_error',
    'estado',
  ],
  defaults: {
    importada_en: () => new Date().toISOString(),
    total_filas: 0,
    filas_nuevas: 0,
    filas_con_cambio: 0,
    filas_error: 0,
    estado: 'pendiente_revision',
  },
  seed: [
    {
      id: 'lista-precios-demo',
      proveedor_id: 'proveedor-demo',
      archivo_nombre: 'lista-distribuidora-demo-2026-11.xlsx',
      formato: 'xlsx',
      fecha_vigencia: '2026-11-21',
      importada_en: '2026-11-21T12:00:00.000Z',
      usuario_id: 'usuario-01',
      total_filas: 1,
      filas_nuevas: 0,
      filas_con_cambio: 1,
      filas_error: 0,
      estado: 'pendiente_revision',
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default listaPreciosModel;
