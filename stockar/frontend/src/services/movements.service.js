import axios from 'axios';

const BASE_URL = '/api/movements';

// El backend responde { status, data } → devolvemos solo data.
// Los movimientos no se editan ni se borran: las correcciones son movimientos de ajuste.
export async function getAll(params) {
  const res = await axios.get(BASE_URL, { params });
  return res.data.data;
}

export async function create(movement) {
  const res = await axios.post(BASE_URL, movement);
  return res.data.data;
}

export default { getAll, create };
