import axios from 'axios';

const BASE_URL = '/api/warehouses';

// El backend responde { status, data } → devolvemos solo data.
export async function getAll(params) {
  const res = await axios.get(BASE_URL, { params });
  return res.data.data;
}

export default { getAll };
