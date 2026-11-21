import { createModel } from './crud.model.js';

export const historialPrecioModel = createModel({
  attributes: ['producto_proveedor_id', 'lista_precios_id', 'precio', 'vigente_desde'],
  defaults: { lista_precios_id: null },
});

export default historialPrecioModel;
