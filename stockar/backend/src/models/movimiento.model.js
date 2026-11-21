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
});

export default movimientoModel;
