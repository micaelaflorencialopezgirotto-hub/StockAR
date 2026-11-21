import { createController } from './crud.controller.js';
import proveedorModel, { MONEDAS, ESTADOS_PROVEEDOR } from '../models/proveedor.model.js';

export const proveedorController = createController(proveedorModel, {
  notFoundMessage: 'Proveedor no encontrado',
  required: ['razon_social'],
  enums: { moneda_lista: MONEDAS, estado: ESTADOS_PROVEEDOR },
});

export default proveedorController;
