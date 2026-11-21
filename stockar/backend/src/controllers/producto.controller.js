import productoModel from '../models/producto.model.js';
import movimientoModel from '../models/movimiento.model.js';
import productoProveedorModel from '../models/productoProveedor.model.js';
import ordenCompraItemModel from '../models/ordenCompraItem.model.js';
import listaPreciosItemModel from '../models/listaPreciosItem.model.js';
import { assertNotInUse, ValidationError } from './crud.controller.js';

// Entidades que guardan el id del producto: si alguna lo usa, no se puede borrar
const USED_BY = [
  { model: movimientoModel, field: 'producto_id', label: ['movimiento', 'movimientos'] },
  { model: productoProveedorModel, field: 'producto_id', label: ['relación producto-proveedor', 'relaciones producto-proveedor'] },
  { model: ordenCompraItemModel, field: 'producto_id', label: ['ítem de orden de compra', 'ítems de orden de compra'] },
  { model: listaPreciosItemModel, field: 'producto_sugerido_id', label: ['ítem de lista de precios', 'ítems de lista de precios'] },
];

async function getAll(req, res) {
  try {
    const data = await productoModel.getAll();
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(500).json({ status: 500, data: { message: 'Error interno del servidor' } });
  }
}

async function getById(req, res) {
  try {
    const data = await productoModel.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ status: 404, data: { message: 'Producto no encontrado' } });
    }
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(500).json({ status: 500, data: { message: 'Error interno del servidor' } });
  }
}

async function create(req, res) {
  try {
    if (!req.body?.sku || !req.body?.nombre) {
      return res.status(400).json({
        status: 400,
        data: { message: 'Los campos sku y nombre son obligatorios' },
      });
    }
    const data = await productoModel.create(req.body);
    return res.status(201).json({ status: 201, data });
  } catch (error) {
    return res.status(500).json({ status: 500, data: { message: 'Error interno del servidor' } });
  }
}

async function update(req, res) {
  try {
    const data = await productoModel.update(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({ status: 404, data: { message: 'Producto no encontrado' } });
    }
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(500).json({ status: 500, data: { message: 'Error interno del servidor' } });
  }
}

async function remove(req, res) {
  try {
    if (!(await productoModel.getById(req.params.id))) {
      return res.status(404).json({ status: 404, data: { message: 'Producto no encontrado' } });
    }
    await assertNotInUse(req.params.id, USED_BY);
    const data = await productoModel.remove(req.params.id);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(error.status).json({ status: error.status, data: { message: error.message } });
    }
    return res.status(500).json({ status: 500, data: { message: 'Error interno del servidor' } });
  }
}

export const productoController = { getAll, getById, create, update, remove };
export { getAll, getById, create, update, remove };
export default productoController;
