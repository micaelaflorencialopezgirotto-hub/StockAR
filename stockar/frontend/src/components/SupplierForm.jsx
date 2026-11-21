import { useEffect, useState } from 'react';
import { create, update } from '../services/suppliers.service.js';

const INITIAL = {
  razon_social: '',
  cuit: '',
  rubro: '',
  contacto_nombre: '',
  email: '',
  telefono: '',
  condicion_pago: '',
  moneda_lista: 'ARS',
  estado: 'activo',
};

// Selects sin opción vacía: si el registro no tiene valor, usan el default.
const SELECTS_WITH_DEFAULT = ['moneda_lista', 'estado'];

function toFormValues(supplier) {
  return Object.fromEntries(
    Object.keys(INITIAL).map((key) => {
      const value = supplier[key];
      if (value == null) return [key, SELECTS_WITH_DEFAULT.includes(key) ? INITIAL[key] : ''];
      return [key, String(value)];
    })
  );
}

// Los campos opcionales vacíos se mandan como null, igual que en los datos del backend.
function toPayload(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value.trim() === '' ? null : value.trim()])
  );
}

// supplier: proveedor a editar, o null para crear uno nuevo.
// onSaved(supplier, { created }): se creó o editó un proveedor.
// onCancel(): se canceló la edición.
export default function SupplierForm({ supplier = null, onSaved, onCancel }) {
  const [values, setValues] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = supplier !== null;

  useEffect(() => {
    setValues(supplier ? toFormValues(supplier) : INITIAL);
    setError(null);
  }, [supplier]);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const saved = isEditing
        ? await update(supplier.id, toPayload(values))
        : await create(toPayload(values));
      if (!isEditing) setValues(INITIAL);
      onSaved?.(saved, { created: !isEditing });
    } catch (err) {
      setError(
        err.response?.data?.data?.message ||
          (isEditing ? 'No se pudo guardar el proveedor' : 'No se pudo crear el proveedor')
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-space-md font-sans">
      <section className="rounded border border-outline-variant bg-surface-container-lowest p-space-lg">
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
          <label className={`${fieldClass} md:col-span-2`}>
            <span className={labelClass}>Razón social <span className="text-error">*</span></span>
            <input name="razon_social" value={values.razon_social} onChange={handleChange} required className={inputClass} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>CUIT</span>
            <input placeholder="30-12345678-9" name="cuit" value={values.cuit} onChange={handleChange} className={`${inputClass} font-label-code text-label-code`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Rubro</span>
            <input name="rubro" value={values.rubro} onChange={handleChange} className={inputClass} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Contacto</span>
            <input name="contacto_nombre" value={values.contacto_nombre} onChange={handleChange} className={inputClass} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Email</span>
            <input type="email" name="email" value={values.email} onChange={handleChange} className={inputClass} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Teléfono</span>
            <input name="telefono" value={values.telefono} onChange={handleChange} className={`${inputClass} font-label-code text-label-code`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Condición de pago</span>
            <input placeholder="30 días" name="condicion_pago" value={values.condicion_pago} onChange={handleChange} className={inputClass} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Moneda de la lista</span>
            <span className="relative">
              <select name="moneda_lista" value={values.moneda_lista} onChange={handleChange} className={selectClass}>
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
              <SelectIcon />
            </span>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Estado</span>
            <span className="relative">
              <select name="estado" value={values.estado} onChange={handleChange} className={selectClass}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <SelectIcon />
            </span>
          </label>
        </div>
      </section>

      {error && <p className={errorClass}>{error}</p>}

      <div className="flex justify-end gap-space-sm">
        {isEditing && (
          <button
            type="button"
            onClick={() => onCancel?.()}
            disabled={submitting}
            className="rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body-md text-body-md font-medium text-on-surface hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded bg-primary-container px-4 py-2 font-body-md text-body-md font-medium text-on-primary hover:bg-on-primary-fixed-variant disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear proveedor'}
        </button>
      </div>
    </form>
  );
}

const fieldClass = 'flex flex-col gap-1.5';
const labelClass = 'font-body-sm text-body-sm font-medium text-on-surface-variant';
const inputClass =
  'h-9 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none';
const selectClass = `${inputClass} appearance-none pr-8`;
const errorClass =
  'rounded border border-error-container bg-surface-container-lowest px-3 py-2 font-body-md text-body-md text-error';

function SelectIcon() {
  return (
    <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline">
      expand_more
    </span>
  );
}
