import { useEffect, useState } from 'react';
import { create } from '../services/products.service.js';
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

const field = { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 };

// Los campos opcionales vacíos se mandan como null, igual que en los datos del backend.
function toPayload(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value.trim() === '' ? null : value.trim()])
  );
}

// suppliersRefreshTrigger: cuando cambia (p. ej. se creó un proveedor), recarga las opciones de los selects.
export default function ProductForm({ onCreated, suppliersRefreshTrigger }) {
  const [values, setValues] = useState(INITIAL);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [optionsError, setOptionsError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      await create(toPayload(values));
      setValues(INITIAL);
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.data?.message || 'No se pudo crear el producto');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <label style={field}>
        Nombre *
        <input name="nombre" value={values.nombre} onChange={handleChange} required />
      </label>

      <label style={field}>
        Código (SKU) *
        <input name="sku" value={values.sku} onChange={handleChange} required />
      </label>

      <label style={field}>
        Marca
        <select name="marca_id" value={values.marca_id} onChange={handleChange}>
          <option value="">— Sin marca —</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>
      </label>

      <label style={field}>
        Modelo
        <input name="modelo" value={values.modelo} onChange={handleChange} />
      </label>

      <label style={field}>
        Descripción
        <textarea name="descripcion_tecnica" value={values.descripcion_tecnica} onChange={handleChange} rows={3} />
      </label>

      <label style={field}>
        Unidad de medida
        <input name="unidad_medida" value={values.unidad_medida} onChange={handleChange} />
      </label>

      <label style={field}>
        Estado
        <select name="estado_catalogo" value={values.estado_catalogo} onChange={handleChange}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </label>

      <label style={field}>
        Proveedor principal
        <select name="proveedor_principal_id" value={values.proveedor_principal_id} onChange={handleChange}>
          <option value="">— Sin proveedor —</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.razon_social}</option>
          ))}
        </select>
      </label>

      {optionsError && <p style={{ color: 'crimson' }}>{optionsError}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : 'Crear producto'}
      </button>
    </form>
  );
}
