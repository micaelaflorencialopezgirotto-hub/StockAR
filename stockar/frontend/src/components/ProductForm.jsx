import { useEffect, useState } from 'react';
import { create, update } from '../services/products.service.js';
import { getAll as getSuppliers } from '../services/suppliers.service.js';
import { getAll as getBrands } from '../services/brands.service.js';

const INITIAL = {
  nombre: '',
  sku: '',
  marca_id: '',
  modelo: '',
  descripcion_tecnica: '',
  unidad_medida: 'u',
  estado_catalogo: 'activo',
  proveedor_principal_id: '',
};

// Selects sin opción vacía: si el registro no tiene valor, usan el default.
const SELECTS_WITH_DEFAULT = ['estado_catalogo'];

function toFormValues(product) {
  return Object.fromEntries(
    Object.keys(INITIAL).map((key) => {
      const value = product[key];
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

// product: producto a editar, o null para crear uno nuevo.
// onSaved(product, { created }): se creó o editó un producto.
// onCancel(): se canceló la edición.
// suppliersRefreshTrigger: cuando cambia (p. ej. se creó un proveedor), recarga las opciones de los selects.
export default function ProductForm({ product = null, onSaved, onCancel, suppliersRefreshTrigger }) {
  const [values, setValues] = useState(INITIAL);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [optionsError, setOptionsError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = product !== null;

  useEffect(() => {
    setValues(product ? toFormValues(product) : INITIAL);
    setError(null);
  }, [product]);

  useEffect(() => {
    setOptionsError(null);
    Promise.all([getSuppliers(), getBrands()])
      .then(([suppliersData, brandsData]) => {
        setSuppliers(suppliersData);
        setBrands(brandsData);
      })
      .catch((err) => {
        setOptionsError(err.response?.data?.data?.message || 'No se pudieron cargar proveedores y marcas');
      });
  }, [suppliersRefreshTrigger]);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const saved = isEditing
        ? await update(product.id, toPayload(values))
        : await create(toPayload(values));
      if (!isEditing) setValues(INITIAL);
      onSaved?.(saved, { created: !isEditing });
    } catch (err) {
      setError(
        err.response?.data?.data?.message ||
          (isEditing ? 'No se pudo guardar el producto' : 'No se pudo crear el producto')
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-space-md font-sans">
      <section className="rounded border border-outline-variant bg-surface-container-lowest p-space-lg">
        <SectionHeader number="01" title="Información general" />
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
          <label className={`${fieldClass} md:col-span-2`}>
            <span className={labelClass}>Nombre <span className="text-error">*</span></span>
            <input name="nombre" value={values.nombre} onChange={handleChange} required className={inputClass} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Código (SKU) <span className="text-error">*</span></span>
            <input name="sku" value={values.sku} onChange={handleChange} required className={`${inputClass} bg-surface-container-low font-label-code text-label-code uppercase`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Marca</span>
            <span className="relative">
              <select name="marca_id" value={values.marca_id} onChange={handleChange} className={selectClass}>
                <option value="">— Sin marca —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
          </label>

          <label className={`${fieldClass} md:col-span-2`}>
            <span className={labelClass}>Modelo</span>
            <input name="modelo" value={values.modelo} onChange={handleChange} className={inputClass} />
          </label>

          <label className={`${fieldClass} md:col-span-3`}>
            <span className={labelClass}>Descripción</span>
            <textarea
              name="descripcion_tecnica"
              value={values.descripcion_tecnica}
              onChange={handleChange}
              rows={3}
              className="w-full resize-y rounded border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded border border-outline-variant bg-surface-container-lowest p-space-lg">
        <SectionHeader number="02" title="Catálogo" />
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <label className={fieldClass}>
            <span className={labelClass}>Unidad de medida</span>
            <input name="unidad_medida" value={values.unidad_medida} onChange={handleChange} className={`${inputClass} font-label-tabular text-label-tabular`} />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Estado</span>
            <span className="relative">
              <select name="estado_catalogo" value={values.estado_catalogo} onChange={handleChange} className={selectClass}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <SelectIcon />
            </span>
          </label>
        </div>
      </section>

      <section className="rounded border border-outline-variant bg-surface-container-lowest p-space-lg">
        <SectionHeader number="03" title="Proveedor" />
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <label className={fieldClass}>
            <span className={labelClass}>Proveedor principal</span>
            <span className="relative">
              <select name="proveedor_principal_id" value={values.proveedor_principal_id} onChange={handleChange} className={selectClass}>
                <option value="">— Sin proveedor —</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.razon_social}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
          </label>
        </div>
      </section>

      {optionsError && <p className={errorClass}>{optionsError}</p>}
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
          className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 font-body-md text-body-md font-medium text-on-primary hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}

const fieldClass = 'flex flex-col gap-1.5';
const labelClass = 'font-body-sm text-body-sm font-medium text-on-surface-variant';
const inputClass =
  'h-9 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 font-body-md text-body-md text-on-surface focus:border-primary focus:outline-none';
const selectClass = `${inputClass} appearance-none pr-8`;
const errorClass =
  'rounded border border-error-container bg-surface-container-lowest px-3 py-2 font-body-md text-body-md text-error';

function SectionHeader({ number, title }) {
  return (
    <div className="mb-space-lg flex items-center gap-space-sm border-b border-surface-container-high pb-space-md">
      <span className="rounded bg-surface-container-low px-1.5 py-0.5 font-label-code text-label-code text-on-surface-variant">{number}</span>
      <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
    </div>
  );
}

function SelectIcon() {
  return (
    <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline">
      expand_more
    </span>
  );
}
