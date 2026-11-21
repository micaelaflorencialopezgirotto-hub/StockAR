// Fábrica de modelos en memoria con CRUD básico.
// Cada entidad define sus atributos, valores por defecto y datos de ejemplo.

function copy(item) {
  return item ? { ...item } : null;
}

export function createModel({ attributes, defaults = {}, seed = [] }) {
  const items = seed.map((item) => ({ ...item }));

  function pickAttributes(source = {}) {
    return attributes.reduce((result, attribute) => {
      if (Object.hasOwn(source, attribute)) {
        result[attribute] = source[attribute];
      }
      return result;
    }, {});
  }

  function resolveDefaults() {
    return Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [key, typeof value === 'function' ? value() : value]),
    );
  }

  return {
    attributes,

    // filters: { atributo: valor } — por ejemplo los query params (?proveedor_id=...)
    async getAll(filters = {}) {
      const entries = Object.entries(filters).filter(([key]) => key === 'id' || attributes.includes(key));
      return items
        .filter((item) => entries.every(([key, value]) => String(item[key]) === String(value)))
        .map(copy);
    },

    async getById(id) {
      return copy(items.find((item) => item.id === id));
    },

    async findOne(predicate) {
      return copy(items.find(predicate));
    },

    async create(data) {
      const now = new Date().toISOString();
      const nuevo = {
        id: crypto.randomUUID(),
        ...resolveDefaults(),
        ...pickAttributes(data),
        creado_en: now,
        actualizado_en: now,
      };
      items.push(nuevo);
      return copy(nuevo);
    },

    async update(id, data) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return null;

      items[index] = {
        ...items[index],
        ...pickAttributes(data),
        actualizado_en: new Date().toISOString(),
      };
      return copy(items[index]);
    },

    async remove(id) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return null;
      const [eliminado] = items.splice(index, 1);
      return copy(eliminado);
    },
  };
}

export default createModel;
