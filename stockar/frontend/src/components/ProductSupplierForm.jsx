import { useEffect, useState } from 'react';
import { create, update } from '../services/productSuppliers.service.js';
import { create as createHistory } from '../services/priceHistory.service.js';
import {
  SelectIcon,
  card,
  errorClass,
  errorMessage,
  fieldClass,
  inputClass,
  labelClass,
  primaryButton,
  secondaryButton,
  selectClass,
} from './ui.jsx';

function initialValues(supplier) {
  return {
    producto_id: '',
    codigo_proveedor: '',
    descripcion_proveedor: '',
    precio_lista: '',
    moneda: supplier?.moneda_lista ?? 'ARS',
    descuento_pct_propio: '',
    stock_proveedor: '',
    activo: true,
  };
}

function toFormValues(offer) {
  const str = (v) => (v == null ? '' : String(v));
  return {
    producto_id: offer.producto_id,
    codigo_proveedor: str(offer.codigo_proveedor),
    descripcion_proveedor: str(offer.descripcion_proveedor),
    precio_lista: str(offer.precio_lista),
    moneda: offer.moneda ?? 'ARS',
    descuento_pct_propio: str(offer.descuento_pct_propio),
    stock_proveedor: str(offer.stock_proveedor),
    activo: offer.activo !== false,
  };
}

function toPayload(values) {
  const num = (v) => (String(v).trim() === '' ? null : Number(v));
  const text = (v) => (v.trim() === '' ? null : v.trim());
  return {
    producto_id: values.producto_id,
    codigo_proveedor: values.codigo_proveedor.trim(),
    descripcion_proveedor: text(values.descripcion_proveedor),
    precio_lista: num(values.precio_lista),
    moneda: values.moneda,
    descuento_pct_propio: num(values.descuento_pct_propio),
    stock_proveedor: num(values.stock_proveedor),
    activo: values.activo,
  };
}

// Carga a mano un producto en la lista de un proveedor, o edita uno ya cargado.
// Cada precio nuevo o cambiado queda en el historial de precios.
// offer: fila de /api/product-suppliers a editar, o null para cargar una nueva.
export default function ProductSupplierForm({ supplier, products, offer = null, onSaved, onCancel }) {
  const [values, setValues] = useState(() => initialValues(supplier));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = offer !== null;

  // Se reinicia al cambiar de proveedor o de fila a editar (no cuando se recarga el mismo proveedor).
  useEffect(() => {
    setValues(offer ? toFormValues(offer) : initialValues(supplier));
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer, supplier?.id]);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = toPayload(values);
    const priceChanged = payload.precio_lista != null && (!isEditing || payload.precio_lista !== offer.precio_lista);
    if (priceChanged) payload.precio_actualizado_en = new Date().toISOString();
    try {
      const saved = isEditing
        ? await update(offer.id, payload)
        : await create({ ...payload, proveedor_id: supplier.id });
      if (priceChanged) {
        await createHistory({
          producto_proveedor_id: saved.id,
          precio: payload.precio_lista,
          vigente_desde: new Date().toISOString().slice(0, 10),
        });
      }
      if (!isEditing) setValues(initialValues(supplier));
      onSaved?.(saved, { created: !isEditing });
    } catch (err) {
      setError(errorMessage(err, isEditing ? 'No se pudo guardar el precio' : 'No se pudo cargar el precio'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-space-md">
      <section className={`${card} p-space-lg`}>
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-4">
          <label className={`${fieldClass} md:col-span-2`}>
            <span className={labelClass}>Producto <span className="text-error">*</span></span>
            <span className="relative">
              <select name="producto_id" value={values.producto_id} onChange={handleChange} required disabled={isEditing} className={`${selectClass} disabled:bg-surface-container-low`}>
                <option value="">— Elegí un producto —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.sku} · {p.nombre}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Código del proveedor <span className="text-error">*</span></span>
            <input name="codigo_proveedor" value={values.codigo_proveedor} onChange={handleChange} required className={`${inputClass} font-label-code text-label-code uppercase`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Moneda</span>
            <span className="relative">
              <select name="moneda" value={values.moneda} onChange={handleChange} className={selectClass}>
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
              <SelectIcon />
            </span>
          </label>

          <label className={`${fieldClass} md:col-span-2`}>
            <span className={labelClass}>Descripción del proveedor</span>
            <input name="descripcion_proveedor" value={values.descripcion_proveedor} onChange={handleChange} className={inputClass} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Precio de lista <span className="text-error">*</span></span>
            <input type="number" name="precio_lista" value={values.precio_lista} onChange={handleChange} required min="0" step="any" className={`${inputClass} text-right font-label-tabular text-label-tabular`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Descuento propio (%)</span>
            <input type="number" name="descuento_pct_propio" value={values.descuento_pct_propio} onChange={handleChange} min="0" max="100" step="any" className={`${inputClass} text-right font-label-tabular text-label-tabular`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Disponibilidad del proveedor</span>
            <input type="number" name="stock_proveedor" value={values.stock_proveedor} onChange={handleChange} min="0" step="any" className={`${inputClass} text-right font-label-tabular text-label-tabular`} />
            <span className="font-body-sm text-body-sm text-outline">Lo que informa el proveedor; no es stock propio.</span>
          </label>

          <label className="flex items-center gap-space-sm self-start pt-7">
            <input type="checkbox" name="activo" checked={values.activo} onChange={handleChange} className="size-4 accent-primary" />
            <span className="font-body-md text-body-md text-on-surface">Activo</span>
          </label>
        </div>
      </section>

      {error && <p className={errorClass}>{error}</p>}

      <div className="flex justify-end gap-space-sm">
        {isEditing && (
          <button type="button" onClick={() => onCancel?.()} disabled={submitting} className={`${secondaryButton} px-4 py-2`}>
            Cancelar
          </button>
        )}
        <button type="submit" disabled={submitting} className={primaryButton}>
          <span className="material-symbols-outlined text-[18px]">save</span>
          {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Agregar a la lista'}
        </button>
      </div>
    </form>
  );
}
