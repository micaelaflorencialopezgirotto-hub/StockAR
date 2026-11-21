import { createModel } from './crud.model.js';

export const ESTADOS_ORDEN = ['borrador', 'enviada', 'recibida_parcial', 'recibida', 'cancelada'];

export const ordenCompraModel = createModel({
  attributes: ['numero', 'proveedor_id', 'estado', 'fecha_entrega_estimada', 'creada_por'],
  defaults: { estado: 'borrador', fecha_entrega_estimada: null },
});

export default ordenCompraModel;
