import { useEffect, useState } from 'react';
import { getAll, remove } from '../services/suppliers.service.js';

const cell = { border: '1px solid #ddd', padding: '6px 8px', textAlign: 'left' };

// onEdit(supplier): se eligió un proveedor para editar.
// onDeleted(supplier): se eliminó un proveedor (App refresca la lista).
export default function SupplierList({ refreshTrigger, onEdit, onDeleted }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAll()
      .then((data) => {
        if (!cancelled) setSuppliers(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.data?.message || 'No se pudo cargar la lista de proveedores');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  async function handleDelete(supplier) {
    if (!window.confirm(`¿Eliminar el proveedor "${supplier.razon_social}"?`)) return;
    setDeletingId(supplier.id);
    setDeleteError(null);
    try {
      await remove(supplier.id);
      onDeleted?.(supplier);
    } catch (err) {
      setDeleteError(err.response?.data?.data?.message || 'No se pudo eliminar el proveedor');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p>Cargando proveedores…</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (suppliers.length === 0) return <p>No hay proveedores cargados.</p>;

  return (
    <>
      {deleteError && <p style={{ color: 'crimson' }}>{deleteError}</p>}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cell}>Razón social</th>
            <th style={cell}>CUIT</th>
            <th style={cell}>Rubro</th>
            <th style={cell}>Contacto</th>
            <th style={cell}>Email</th>
            <th style={cell}>Teléfono</th>
            <th style={cell}>Moneda</th>
            <th style={cell}>Estado</th>
            <th style={cell}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td style={cell}>{s.razon_social}</td>
              <td style={cell}>{s.cuit ?? '—'}</td>
              <td style={cell}>{s.rubro ?? '—'}</td>
              <td style={cell}>{s.contacto_nombre ?? '—'}</td>
              <td style={cell}>{s.email ?? '—'}</td>
              <td style={cell}>{s.telefono ?? '—'}</td>
              <td style={cell}>{s.moneda_lista ?? '—'}</td>
              <td style={cell}>{s.estado ?? '—'}</td>
              <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                <button type="button" onClick={() => onEdit?.(s)}>Editar</button>{' '}
                <button type="button" onClick={() => handleDelete(s)} disabled={deletingId === s.id}>
                  {deletingId === s.id ? 'Eliminando…' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
