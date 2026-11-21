import productoModel from '../models/producto.model.js';

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
    const data = await productoModel.remove(req.params.id);
    if (!data) {
      return res.status(404).json({ status: 404, data: { message: 'Producto no encontrado' } });
    }
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(500).json({ status: 500, data: { message: 'Error interno del servidor' } });
  }
}

export const productoController = { getAll, getById, create, update, remove };
export { getAll, getById, create, update, remove };
export default productoController;
