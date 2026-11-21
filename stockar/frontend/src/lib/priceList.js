// Importación de listas de precios de proveedores en CSV.
// El backend solo guarda los registros: la lectura, el cruce y la aplicación se hacen acá.
import { create as createProductSupplier, update as updateProductSupplier } from '../services/productSuppliers.service.js';
import { create as createHistory } from '../services/priceHistory.service.js';
import { update as updateItem } from '../services/priceListItems.service.js';
import { update as updateList } from '../services/priceLists.service.js';

// Lee un CSV con comillas dobles. Detecta el separador (; o ,) en la primera línea.
export function parseCsv(text) {
  const clean = text.replace(/^﻿/, '');
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? '';
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';

  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (quoted) {
      if (c === '"' && clean[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && clean[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

// "A" → 0, "B" → 1, …, "AA" → 26.
export function columnIndex(letter) {
  const clean = String(letter ?? '').trim().toUpperCase();
  if (!/^[A-Z]+$/.test(clean)) return -1;
  return [...clean].reduce((n, ch) => n * 26 + (ch.charCodeAt(0) - 64), 0) - 1;
}

// Acepta "1.234,56", "1234,56", "1,234.56", "1234.56" y "$ 1.234". Devuelve null si no es un número > 0.
export function parsePrice(raw) {
  let s = String(raw ?? '').replace(/[^\d.,-]/g, '');
  if (!s) return null;
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
  else if (lastDot > lastComma && lastComma !== -1) s = s.replace(/,/g, '');
  else if (lastDot !== -1 && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ''); // "1.234" = mil
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Cruza cada fila con los productos que el proveedor ya tiene cargados (por código de proveedor).
// mapping: { codigo, descripcion, precio } con letras de columna.
export function buildItems(rows, mapping, offers, hasHeader) {
  const idx = {
    codigo: columnIndex(mapping.codigo),
    descripcion: columnIndex(mapping.descripcion),
    precio: columnIndex(mapping.precio),
  };
  const byCode = Object.fromEntries(offers.map((o) => [String(o.codigo_proveedor).trim().toUpperCase(), o]));
  const start = hasHeader ? 1 : 0;

  return rows.slice(start).map((row, i) => {
    const codigo = (row[idx.codigo] ?? '').trim();
    const descripcion = idx.descripcion >= 0 ? (row[idx.descripcion] ?? '').trim() || null : null;
    const precio = parsePrice(row[idx.precio]);
    const item = {
      nro_fila: i + start + 1,
      codigo_proveedor: codigo || null,
      descripcion,
      precio_nuevo: precio,
      precio_anterior: null,
      tipo_cambio: 'nuevo',
      producto_proveedor_id: null,
      mensaje_error: null,
    };
    if (!codigo) return { ...item, tipo_cambio: 'error', mensaje_error: 'Falta el código' };
    if (precio == null) return { ...item, tipo_cambio: 'error', mensaje_error: `Precio inválido: "${row[idx.precio] ?? ''}"` };

    const offer = byCode[codigo.toUpperCase()];
    if (!offer) return item;
    return {
      ...item,
      producto_proveedor_id: offer.id,
      precio_anterior: offer.precio_lista,
      tipo_cambio: offer.precio_lista === precio ? 'sin_cambio' : 'precio',
    };
  });
}

export function summarize(items) {
  return {
    total_filas: items.length,
    filas_nuevas: items.filter((i) => i.tipo_cambio === 'nuevo').length,
    filas_con_cambio: items.filter((i) => i.tipo_cambio === 'precio').length,
    filas_error: items.filter((i) => i.tipo_cambio === 'error').length,
  };
}

// Aplica una lista ítem por ítem. No hay transacción: cada ítem aplicado queda marcado como resuelto,
// así que si algo falla se puede volver a aplicar y sigue desde donde quedó.
// productChoices: { itemId: productoId } para los ítems nuevos que se asociaron a un producto.
// Devuelve { applied, skipped, errors: [{ item, message }] }.
export async function applyPriceList(list, items, { supplier, productChoices }) {
  const vigente = list.fecha_vigencia ?? new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  const result = { applied: 0, skipped: 0, errors: [] };

  for (const item of items) {
    if (item.resuelto) continue;
    try {
      if (item.tipo_cambio === 'precio') {
        await updateProductSupplier(item.producto_proveedor_id, { precio_lista: item.precio_nuevo, precio_actualizado_en: now });
        await createHistory({ producto_proveedor_id: item.producto_proveedor_id, lista_precios_id: list.id, precio: item.precio_nuevo, vigente_desde: vigente });
        await updateItem(item.id, { resuelto: true });
        result.applied++;
      } else if (item.tipo_cambio === 'nuevo' && productChoices[item.id]) {
        const created = await createProductSupplier({
          producto_id: productChoices[item.id],
          proveedor_id: list.proveedor_id,
          codigo_proveedor: item.codigo_proveedor,
          descripcion_proveedor: item.descripcion,
          precio_lista: item.precio_nuevo,
          moneda: supplier?.moneda_lista ?? 'ARS',
          precio_actualizado_en: now,
        });
        await createHistory({ producto_proveedor_id: created.id, lista_precios_id: list.id, precio: item.precio_nuevo, vigente_desde: vigente });
        await updateItem(item.id, { resuelto: true, producto_proveedor_id: created.id, producto_sugerido_id: productChoices[item.id] });
        result.applied++;
      } else {
        result.skipped++;
      }
    } catch (err) {
      result.errors.push({ item, message: err.response?.data?.data?.message || 'Error desconocido' });
    }
  }

  if (result.errors.length === 0) await updateList(list.id, { estado: 'aplicada' });
  return result;
}
