import { createModel } from './crud.model.js';

export const MONEDAS = ['ARS', 'USD'];
export const ESTADOS_PROVEEDOR = ['activo', 'inactivo'];

export const proveedorModel = createModel({
  attributes: [
    'razon_social',
    'cuit',
    'rubro',
    'contacto_nombre',
    'email',
    'telefono',
    'calificacion',
    'plazo_entrega_hs',
    'pedido_minimo',
    'condicion_pago',
    'moneda_lista',
    'descuento_pct',
    'bonificacion_pct',
    'gasto_adicional_pct',
    'dias_vigencia_lista',
    'mapeo_columnas',
    'estado',
  ],
  defaults: {
    contacto_nombre: null,
    email: null,
    telefono: null,
    calificacion: null,
    moneda_lista: 'ARS',
    descuento_pct: 0,
    bonificacion_pct: 0,
    gasto_adicional_pct: 0,
    mapeo_columnas: () => ({}),
    estado: 'activo',
  },
  seed: [
    {
      id: 'proveedor-demo',
      razon_social: 'Distribuidora Demo S.A.',
      cuit: '30-12345678-9',
      rubro: 'Ferretería',
      contacto_nombre: 'Laura Gómez',
      email: 'ventas@distribuidorademo.com',
      telefono: '+54 351 555-0101',
      calificacion: 4,
      plazo_entrega_hs: 48,
      pedido_minimo: 50000,
      condicion_pago: '30 días',
      moneda_lista: 'ARS',
      descuento_pct: 10,
      bonificacion_pct: 0,
      gasto_adicional_pct: 5,
      dias_vigencia_lista: 30,
      mapeo_columnas: { codigo: 'A', descripcion: 'B', precio: 'C' },
      estado: 'activo',
      creado_en: '2026-11-20T12:00:00.000Z',
      actualizado_en: '2026-11-20T12:00:00.000Z',
    },
  ],
});

export default proveedorModel;
