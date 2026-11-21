const PRODUCT_ATTRIBUTES = [
  'sku',
  'nombre',
  'descripcion_tecnica',
  'codigo_barras',
  'categoria_id',
  'marca_id',
  'modelo',
  'especificaciones',
  'imagen',
  'unidad_medida',
  'unidades_por_paquete',
  'estado_catalogo',
  'stock_actual',
  'stock_reservado',
  'stock_minimo',
  'deposito_id',
  'ubicacion',
  'proveedor_principal_id',
  'alicuota_iva',
  'margen_pct',
  'costo_neto',
  'precio_venta',
  'precio_venta_actualizado_en',
];

let productos = [
  {
    id: 'producto-01',
    sku: 'TOR-HEX-010',
    nombre: 'Tornillo hexagonal 10 mm',
    descripcion_tecnica: 'Tornillo hexagonal galvanizado',
    codigo_barras: '779000000001',
    categoria_id: 'categoria-01',
    marca_id: 'marca-01',
    modelo: null,
    especificaciones: { medida: 'M10', longitud_mm: 40 },
    imagen: null,
    unidad_medida: 'u',
    unidades_por_paquete: 100,
    estado_catalogo: 'activo',
    stock_actual: 250,
    stock_reservado: 10,
    stock_minimo: 50,
    deposito_id: 'deposito-01',
    ubicacion: 'Pasillo A · Est. 01',
    proveedor_principal_id: null,
    alicuota_iva: 21,
    margen_pct: 35,
    costo_neto: 125,
    precio_venta: 168.75,
    precio_venta_actualizado_en: '2026-11-20T12:00:00.000Z',
    creado_en: '2026-11-20T12:00:00.000Z',
    actualizado_en: '2026-11-20T12:00:00.000Z',
  },
  {
    id: 'producto-99',
    sku: 'DIS-ESM-125',
    nombre: 'Disco de corte 125 mm',
    descripcion_tecnica: null,
    codigo_barras: null,
    categoria_id: 'categoria-02',
    marca_id: null,
    modelo: null,
    especificaciones: {},
    imagen: null,
    unidad_medida: 'u',
    unidades_por_paquete: null,
    estado_catalogo: 'activo',
    stock_actual: 18,
    stock_reservado: 2,
    stock_minimo: 10,
    deposito_id: 'deposito-01',
    ubicacion: null,
    proveedor_principal_id: null,
    alicuota_iva: 21,
    margen_pct: 30,
    costo_neto: 500,
    precio_venta: 650,
    precio_venta_actualizado_en: null,
    creado_en: '2026-11-20T12:00:00.000Z',
    actualizado_en: '2026-11-20T12:00:00.000Z',
  },
];

function pickAttributes(source) {
  return PRODUCT_ATTRIBUTES.reduce((result, attribute) => {
    if (Object.prototype.hasOwnProperty.call(source, attribute)) {
      result[attribute] = source[attribute];
    }
    return result;
  }, {});
}

export const productoModel = {
  // filters: { atributo: valor } — por ejemplo los query params (?estado_catalogo=activo).
  // Mismo criterio que crud.model.js: se ignoran las claves que no son atributos del producto.
  async getAll(filters = {}) {
    const entries = Object.entries(filters).filter(
      ([key]) => key === 'id' || PRODUCT_ATTRIBUTES.includes(key),
    );
    return productos
      .filter((producto) => entries.every(([key, value]) => String(producto[key]) === String(value)))
      .map((producto) => ({ ...producto }));
  },

  async getById(id) {
    const producto = productos.find((item) => item.id === id);
    return producto ? { ...producto } : null;
  },

  async create(data) {
    const now = new Date().toISOString();
    const nuevo = {
      id: crypto.randomUUID(),
      ...pickAttributes(data),
      creado_en: now,
      actualizado_en: now,
    };
    productos.push(nuevo);
    return { ...nuevo };
  },

  async update(id, data) {
    const index = productos.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const actualizado = {
      ...productos[index],
      ...pickAttributes(data),
      actualizado_en: new Date().toISOString(),
    };
    productos[index] = actualizado;
    return { ...actualizado };
  },

  async remove(id) {
    const index = productos.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const [eliminado] = productos.splice(index, 1);
    return { ...eliminado };
  },
};

export default productoModel;
