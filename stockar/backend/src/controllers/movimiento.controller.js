import { createController, getBody, handleError, ValidationError } from './crud.controller.js';
import movimientoModel, { TIPOS_MOVIMIENTO } from '../models/movimiento.model.js';
import productoModel from '../models/producto.model.js';
import depositoModel from '../models/deposito.model.js';
import usuarioModel from '../models/usuario.model.js';
import ordenCompraModel from '../models/ordenCompra.model.js';

// Signo que debe tener la cantidad según el tipo (0 = cualquiera distinto de 0)
const SIGNO = {
  entrada_compra: 1,
  salida_mostrador: -1,
  salida_obra: -1,
  salida_taller: -1,
  ajuste: 0,
  merma: -1,
  reserva: 1,
  liberacion_reserva: -1,
};

// Estos tipos modifican stock_reservado; el resto modifica stock_actual
const TIPOS_RESERVA = ['reserva', 'liberacion_reserva'];

const base = createController(movimientoModel, {
  notFoundMessage: 'Movimiento no encontrado',
  required: ['producto_id', 'deposito_id', 'tipo', 'cantidad'],
  enums: { tipo: TIPOS_MOVIMIENTO },
  references: {
    producto_id: productoModel,
    deposito_id: depositoModel,
    usuario_id: usuarioModel,
    orden_compra_id: ordenCompraModel,
  },
});

async function create(req, res) {
  try {
    const body = getBody(req);
    await base.check(body);

    const { tipo, cantidad } = body;
    if (typeof cantidad !== 'number' || !Number.isFinite(cantidad) || cantidad === 0) {
      throw new ValidationError(400, 'La cantidad debe ser un número distinto de 0');
    }
    if (SIGNO[tipo] * cantidad < 0) {
      throw new ValidationError(
        400,
        `Para el tipo ${tipo} la cantidad debe ser ${SIGNO[tipo] > 0 ? 'positiva' : 'negativa'}`,
      );
    }

    const producto = await productoModel.getById(body.producto_id);
    let stockActual = Number(producto.stock_actual ?? 0);
    let stockReservado = Number(producto.stock_reservado ?? 0);

    if (TIPOS_RESERVA.includes(tipo)) {
      stockReservado += cantidad;
    } else {
      stockActual += cantidad;
    }

    if (stockActual < 0) {
      throw new ValidationError(400, `Stock insuficiente: el saldo quedaría en ${stockActual}`);
    }
    if (stockReservado < 0) {
      throw new ValidationError(400, 'No se puede liberar más stock del que está reservado');
    }
    if (tipo === 'reserva' && stockReservado > stockActual) {
      throw new ValidationError(400, 'No hay stock disponible suficiente para reservar');
    }

    const data = await movimientoModel.create({
      ...body,
      saldo_posterior: stockActual,
      fecha_hora: new Date().toISOString(),
    });
    await productoModel.update(producto.id, {
      stock_actual: stockActual,
      stock_reservado: stockReservado,
    });

    return res.status(201).json({ status: 201, data });
  } catch (error) {
    return handleError(res, error);
  }
}

// Sin update ni remove: las correcciones se hacen con un movimiento de ajuste.
export const movimientoController = {
  getAll: base.getAll,
  getById: base.getById,
  create,
};

export default movimientoController;
