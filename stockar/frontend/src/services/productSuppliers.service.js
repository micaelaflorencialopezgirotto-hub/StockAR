import axios from 'axios';

const BASE_URL = '/api/product-suppliers';

// El backend responde { status, data } → devolvemos solo data.
// Cada fila es un producto en la lista de un proveedor: código, precio de lista y disponibilidad informada.
export async function getAll(params) {
  const res = await axios.get(BASE_URL, { params });
  return res.data.data;
}

export async function create(productSupplier) {
  const res = await axios.post(BASE_URL, productSupplier);
  return res.data.data;
}

export async function update(id, changes) {
  const res = await axios.patch(`${BASE_URL}/${id}`, changes);
  return res.data.data;
}

export default { getAll, create, update };
