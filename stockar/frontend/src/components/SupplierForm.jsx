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

const field = { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 };

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
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <label style={field}>
        Razón social *
        <input name="razon_social" value={values.razon_social} onChange={handleChange} required />
      </label>

      <label style={field}>
        CUIT
        <input name="cuit" value={values.cuit} onChange={handleChange} placeholder="30-12345678-9" />
      </label>

      <label style={field}>
        Rubro
        <input name="rubro" value={values.rubro} onChange={handleChange} />
      </label>

      <label style={field}>
        Contacto
        <input name="contacto_nombre" value={values.contacto_nombre} onChange={handleChange} />
      </label>

      <label style={field}>
        Email
        <input type="email" name="email" value={values.email} onChange={handleChange} />
      </label>

      <label style={field}>
        Teléfono
        <input name="telefono" value={values.telefono} onChange={handleChange} />
      </label>

      <label style={field}>
        Condición de pago
        <input name="condicion_pago" value={values.condicion_pago} onChange={handleChange} placeholder="30 días" />
      </label>

      <label style={field}>
        Moneda de la lista
        <select name="moneda_lista" value={values.moneda_lista} onChange={handleChange}>
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
        </select>
      </label>

      <label style={field}>
        Estado
        <select name="estado" value={values.estado} onChange={handleChange}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </label>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear proveedor'}
      </button>
      {isEditing && (
        <>
          {' '}
          <button type="button" onClick={() => onCancel?.()} disabled={submitting}>Cancelar</button>
        </>
      )}
    </form>
  );
}
