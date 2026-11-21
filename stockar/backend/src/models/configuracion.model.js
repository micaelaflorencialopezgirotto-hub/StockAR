// Configuración general: una sola fila.

export const CONFIG_ATTRIBUTES = ['iva_default', 'margen_default', 'tipo_cambio_usd', 'dias_vigencia_default'];

let configuracion = {
  id: 'configuracion-01',
  iva_default: 21,
  margen_default: 30,
  tipo_cambio_usd: null, // carga manual
  dias_vigencia_default: 20,
  creado_en: '2026-11-20T12:00:00.000Z',
  actualizado_en: '2026-11-20T12:00:00.000Z',
};

export const configuracionModel = {
  async get() {
    return { ...configuracion };
  },

  async update(data) {
    const cambios = Object.fromEntries(
      CONFIG_ATTRIBUTES.filter((key) => Object.hasOwn(data, key)).map((key) => [key, data[key]]),
    );
    configuracion = { ...configuracion, ...cambios, actualizado_en: new Date().toISOString() };
    return { ...configuracion };
  },
};

export default configuracionModel;
