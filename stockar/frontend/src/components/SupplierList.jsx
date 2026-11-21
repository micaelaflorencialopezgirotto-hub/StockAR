import { useEffect, useState } from 'react';
import { getAll } from '../services/suppliers.service.js';

const cell = { border: '1px solid #ddd', padding: '6px 8px', textAlign: 'left' };

export default function SupplierList({ refreshTrigger }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Cargando proveedores…</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (suppliers.length === 0) return <p>No hay proveedores cargados.</p>;

  return (
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
