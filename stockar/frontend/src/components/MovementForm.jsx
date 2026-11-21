import { useEffect, useState } from 'react';
import { create } from '../services/movements.service.js';
import {
  MOVEMENT_TYPES,
  SelectIcon,
  card,
  errorClass,
  errorMessage,
  fieldClass,
  formatQty,
  inputClass,
  labelClass,
  primaryButton,
  selectClass,
} from './ui.jsx';

const INITIAL = {
  producto_id: '',
  deposito_id: '',
  tipo: 'entrada_compra',
  cantidad: '',
  comprobante_ref: '',
  costo_unitario: '',
  detalle: '',
};

// La cantidad se escribe en positivo y toma el signo del tipo; en un ajuste se escribe con signo.
function toPayload(values) {
  const { sign } = MOVEMENT_TYPES[values.tipo];
  const cantidad = Number(values.cantidad);
  const text = (v) => (v.trim() === '' ? null : v.trim());
  return {
    producto_id: values.producto_id,
    deposito_id: values.deposito_id,
    tipo: values.tipo,
    cantidad: sign === 0 ? cantidad : sign * Math.abs(cantidad),
    comprobante_ref: text(values.comprobante_ref),
    costo_unitario: values.costo_unitario === '' ? null : Number(values.costo_unitario),
    detalle: text(values.detalle),
  };
}

// products y warehouses los carga la página. onSaved(movement): se registró un movimiento.
export default function MovementForm({ products, warehouses, onSaved }) {
  const [values, setValues] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Depósito predeterminado preseleccionado cuando llegan los depósitos.
  useEffect(() => {
    if (values.deposito_id || warehouses.length === 0) return;
    const preferred = warehouses.find((w) => w.es_predeterminado) ?? warehouses[0];
    setValues((v) => ({ ...v, deposito_id: preferred.id }));
  }, [warehouses, values.deposito_id]);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const saved = await create(toPayload(values));
      setValues({ ...INITIAL, deposito_id: values.deposito_id });
      onSaved?.(saved);
    } catch (err) {
      setError(errorMessage(err, 'No se pudo registrar el movimiento'));
    } finally {
      setSubmitting(false);
    }
  }

  const type = MOVEMENT_TYPES[values.tipo];
  const product = products.find((p) => p.id === values.producto_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-space-md">
      <section className={`${card} p-space-lg`}>
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-4">
          <label className={`${fieldClass} md:col-span-2`}>
            <span className={labelClass}>Producto <span className="text-error">*</span></span>
            <span className="relative">
              <select name="producto_id" value={values.producto_id} onChange={handleChange} required className={selectClass}>
                <option value="">— Elegí un producto —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.sku} · {p.nombre}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
            {product && (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Stock en depósito: <span className="font-label-code text-label-code">{formatQty(product.stock_actual, product.unidad_medida)}</span>
                {' · '}reservado: <span className="font-label-code text-label-code">{formatQty(product.stock_reservado, product.unidad_medida)}</span>
              </span>
            )}
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Tipo <span className="text-error">*</span></span>
            <span className="relative">
              <select name="tipo" value={values.tipo} onChange={handleChange} className={selectClass}>
                {Object.entries(MOVEMENT_TYPES).map(([value, t]) => (
                  <option key={value} value={value}>{t.label}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Depósito <span className="text-error">*</span></span>
            <span className="relative">
              <select name="deposito_id" value={values.deposito_id} onChange={handleChange} required className={selectClass}>
                <option value="">— Elegí un depósito —</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.nombre}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Cantidad <span className="text-error">*</span></span>
            <input
              type="number"
              name="cantidad"
              value={values.cantidad}
              onChange={handleChange}
              required
              step="any"
              min={type.sign === 0 ? undefined : 0}
              className={`${inputClass} text-right font-label-tabular text-label-tabular`}
            />
            <span className="font-body-sm text-body-sm text-outline">
              {type.sign === 0 ? 'Con signo: + suma, − resta.' : type.sign > 0 ? 'Se suma.' : 'Se resta.'}
            </span>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Costo unitario</span>
            <input
              type="number"
              name="costo_unitario"
              value={values.costo_unitario}
              onChange={handleChange}
              step="any"
              min="0"
              className={`${inputClass} text-right font-label-tabular text-label-tabular`}
            />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Comprobante</span>
            <input name="comprobante_ref" value={values.comprobante_ref} onChange={handleChange} placeholder="FC-A-0001-00000000" className={`${inputClass} font-label-code text-label-code`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Detalle</span>
            <input name="detalle" value={values.detalle} onChange={handleChange} className={inputClass} />
          </label>
        </div>
      </section>

      {error && <p className={errorClass}>{error}</p>}

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className={primaryButton}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          {submitting ? 'Registrando…' : 'Registrar movimiento'}
        </button>
      </div>
    </form>
  );
}
