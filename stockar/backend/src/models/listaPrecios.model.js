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
});

export default listaPreciosModel;
