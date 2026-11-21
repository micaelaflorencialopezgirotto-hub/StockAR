import { getBody, handleError, ValidationError } from './crud.controller.js';
import configuracionModel, { CONFIG_ATTRIBUTES } from '../models/configuracion.model.js';

async function get(req, res) {
  try {
    const data = await configuracionModel.get();
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return handleError(res, error);
  }
}

async function update(req, res) {
  try {
    const body = getBody(req);
    for (const key of CONFIG_ATTRIBUTES) {
      if (!Object.hasOwn(body, key)) continue;
      const value = body[key];
      const nullable = key === 'tipo_cambio_usd';
      if ((value === null && !nullable) || (value !== null && (typeof value !== 'number' || value < 0))) {
        throw new ValidationError(400, `El campo ${key} debe ser un número mayor o igual a 0`);
      }
    }
    const data = await configuracionModel.update(body);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return handleError(res, error);
  }
}

export const configuracionController = { get, update };
export default configuracionController;
