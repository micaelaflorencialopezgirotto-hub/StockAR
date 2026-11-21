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
});

export default proveedorModel;
