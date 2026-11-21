import { createModel } from './crud.model.js';

export const ESTADOS_ORDEN = ['borrador', 'enviada', 'recibida_parcial', 'recibida', 'cancelada'];

export const ordenCompraModel = createModel({
  attributes: ['numero', 'proveedor_id', 'estado', 'fecha_entrega_estimada', 'creada_por'],
  defaults: { estado: 'borrador', fecha_entrega_estimada: null },
  seed: [
    {
      id: 'orden-compra-demo',
      numero: 'OC-0001',
      proveedor_id: 'proveedor-demo',
      estado: 'borrador',
      fecha_entrega_estimada: '2026-11-25',
      creada_por: 'usuario-01',
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default ordenCompraModel;
