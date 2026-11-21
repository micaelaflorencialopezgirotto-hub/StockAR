import axios from 'axios';

const BASE_URL = '/api/products';

// El backend responde { status, data } → devolvemos solo data.
export async function getAll(params) {
  const res = await axios.get(BASE_URL, { params });
  return res.data.data;
}

export async function getById(id) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data.data;
}

export async function create(product) {
  const res = await axios.post(BASE_URL, product);
  return res.data.data;
}

export async function update(id, changes) {
  const res = await axios.patch(`${BASE_URL}/${id}`, changes);
  return res.data.data;
}

export async function remove(id) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data.data;
}

export default { getAll, getById, create, update, remove };
