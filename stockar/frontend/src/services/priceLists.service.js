import axios from 'axios';

const BASE_URL = '/api/price-lists';

// El backend responde { status, data } → devolvemos solo data.
export async function getAll(params) {
  const res = await axios.get(BASE_URL, { params });
  return res.data.data;
}

export async function create(record) {
  const res = await axios.post(BASE_URL, record);
  return res.data.data;
}

export async function update(id, changes) {
  const res = await axios.patch(`${BASE_URL}/${id}`, changes);
  return res.data.data;
}

export default { getAll, create, update };
