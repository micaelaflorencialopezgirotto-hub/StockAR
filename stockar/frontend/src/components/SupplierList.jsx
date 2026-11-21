import { useEffect, useState } from 'react';
import { getAll, remove } from '../services/suppliers.service.js';
import { StatusPill, activeTone } from './ui.jsx';

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

  if (loading) return <p className="font-sans font-body-md text-body-md text-on-surface-variant">Cargando proveedores…</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (suppliers.length === 0) {
    return (
      <p className="rounded border border-outline-variant bg-surface-container-lowest p-space-lg text-center font-sans font-body-md text-body-md text-on-surface-variant">
        No hay proveedores cargados.
      </p>
    );
  }

  return (
    <>
      {deleteError && <p className={`mb-space-md ${errorClass}`}>{deleteError}</p>}
      <div className="overflow-x-auto rounded border border-outline-variant bg-surface-container-lowest font-sans">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              <th className={th}>Razón social</th>
              <th className={th}>CUIT</th>
              <th className={th}>Rubro</th>
              <th className={th}>Contacto</th>
              <th className={th}>Moneda</th>
              <th className={th}>Estado</th>
              <th className={`${th} text-right`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                <td className={`${td} min-w-44 font-medium text-on-surface`}>{s.razon_social}</td>
                <td className={`${td} whitespace-nowrap font-label-code text-label-code`}>{s.cuit ?? '—'}</td>
                <td className={td}>{s.rubro ?? '—'}</td>
                <td className={td}>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-on-surface">{s.contacto_nombre ?? '—'}</span>
                    {s.email && (
                      <a href={`mailto:${s.email}`} className="max-w-64 truncate text-info hover:underline" title={s.email}>{s.email}</a>
                    )}
                    {s.telefono && <span className="whitespace-nowrap font-label-code text-label-code">{s.telefono}</span>}
                  </span>
                </td>
                <td className={`${td} font-label-code text-label-code`}>{s.moneda_lista ?? '—'}</td>
                <td className={td}>
                  <StatusPill tone={activeTone(s.estado)}>{s.estado ?? '—'}</StatusPill>
                </td>
                <td className={`${td} whitespace-nowrap text-right`}>
                  <span className="inline-flex gap-space-xs">
                    <button
                      type="button"
                      onClick={() => onEdit?.(s)}
                      title="Editar"
                      aria-label={`Editar ${s.razon_social}`}
                      className="rounded border border-outline-variant bg-surface-container-lowest p-1.5 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      disabled={deletingId === s.id}
                      title={deletingId === s.id ? 'Eliminando…' : 'Eliminar'}
                      aria-label={`Eliminar ${s.razon_social}`}
                      className="rounded border border-error-container bg-surface-container-lowest p-1.5 text-error hover:bg-error-container/40 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      <span className="material-symbols-outlined text-[18px]">{deletingId === s.id ? 'hourglass_empty' : 'delete'}</span>
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const th = 'whitespace-nowrap px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant';
const td = 'px-4 py-3 font-body-md text-body-md text-on-surface-variant';
const errorClass =
  'rounded border border-error-container bg-surface-container-lowest px-3 py-2 font-sans font-body-md text-body-md text-error';
