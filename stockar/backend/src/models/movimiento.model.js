import { createModel } from './crud.model.js';

export const TIPOS_MOVIMIENTO = [
  'entrada_compra',
  'salida_mostrador',
  'salida_obra',
  'salida_taller',
  'ajuste',
  'merma',
  'reserva',
  'liberacion_reserva',
];

// Kárdex inmutable: solo se crean movimientos, nunca se editan ni se borran.
export const movimientoModel = createModel({
  attributes: [
    'producto_id',
    'deposito_id',
    'tipo',
    'cantidad',
    'saldo_posterior',
    'fecha_hora',
    'usuario_id',
    'comprobante_ref',
    'orden_compra_id',
    'costo_unitario',
    'detalle',
  ],
  defaults: {
    usuario_id: null,
    comprobante_ref: null,
    orden_compra_id: null,
    costo_unitario: null,
    detalle: null,
  },
  seed: [
    {
      id: 'movimiento-demo',
      producto_id: 'producto-01',
      deposito_id: 'deposito-01',
      tipo: 'entrada_compra',
      cantidad: 250,
      saldo_posterior: 250,
      fecha_hora: '2026-11-20T12:00:00.000Z',
      usuario_id: 'usuario-01',
      comprobante_ref: 'FC-A-0001-00001234',
      orden_compra_id: null,
      costo_unitario: 125,
      detalle: 'Stock inicial',
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default movimientoModel;
