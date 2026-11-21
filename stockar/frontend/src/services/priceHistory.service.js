import axios from 'axios';

const BASE_URL = '/api/price-history';

// El backend responde { status, data } → devolvemos solo data.
export async function getAll(params) {
  const res = await axios.get(BASE_URL, { params });
  return res.data.data;
}

export async function create(record) {
  const res = await axios.post(BASE_URL, record);
  return res.data.data;
}

export default { getAll, create };
