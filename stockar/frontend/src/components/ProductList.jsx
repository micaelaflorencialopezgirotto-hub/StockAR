import { useEffect, useState } from 'react';
import { getAll as getProducts, remove } from '../services/products.service.js';
import { getAll as getBrands } from '../services/brands.service.js';

const cell = { border: '1px solid #ddd', padding: '6px 8px', textAlign: 'left' };

// onEdit(product): se eligió un producto para editar.
// onDeleted(product): se eliminó un producto (App refresca la lista).
export default function ProductList({ refreshTrigger, onEdit, onDeleted }) {
  const [products, setProducts] = useState([]);
  const [brandNames, setBrandNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getProducts(), getBrands()])
      .then(([productsData, brandsData]) => {
        if (cancelled) return;
        setProducts(productsData);
        setBrandNames(Object.fromEntries(brandsData.map((b) => [b.id, b.nombre])));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.data?.message || 'No se pudo cargar la lista de productos');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar el producto "${product.nombre}"?`)) return;
    setDeletingId(product.id);
    setDeleteError(null);
    try {
      await remove(product.id);
      onDeleted?.(product);
    } catch (err) {
      setDeleteError(err.response?.data?.data?.message || 'No se pudo eliminar el producto');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p>Cargando productos…</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (products.length === 0) return <p>No hay productos cargados.</p>;

  return (
    <>
      {deleteError && <p style={{ color: 'crimson' }}>{deleteError}</p>}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cell}>Nombre</th>
            <th style={cell}>Código</th>
            <th style={cell}>Marca</th>
            <th style={cell}>Modelo</th>
            <th style={cell}>Descripción</th>
            <th style={cell}>Estado</th>
            <th style={cell}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={cell}>{p.nombre}</td>
              <td style={cell}>{p.sku}</td>
              <td style={cell}>{brandNames[p.marca_id] ?? '—'}</td>
              <td style={cell}>{p.modelo ?? '—'}</td>
              <td style={cell}>{p.descripcion_tecnica ?? '—'}</td>
              <td style={cell}>{p.estado_catalogo ?? '—'}</td>
              <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                <button type="button" onClick={() => onEdit?.(p)}>Editar</button>{' '}
                <button type="button" onClick={() => handleDelete(p)} disabled={deletingId === p.id}>
                  {deletingId === p.id ? 'Eliminando…' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
