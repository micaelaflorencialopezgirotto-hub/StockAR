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
  const [estadoFilter, setEstadoFilter] = useState(''); // '' = todos

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const filters = estadoFilter ? { estado_catalogo: estadoFilter } : undefined;

    Promise.all([getProducts(filters), getBrands()])
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
  }, [refreshTrigger, estadoFilter]);

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

  // El filtro queda visible mientras carga, si hay error o si no hay resultados.
  const filterBar = (
    <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
      Estado
      <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
        <option value="">Todos</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </label>
  );

  let content;
  if (loading) content = <p>Cargando productos…</p>;
  else if (error) content = <p style={{ color: 'crimson' }}>{error}</p>;
  else if (products.length === 0) {
    content = <p>{estadoFilter ? `No hay productos con estado "${estadoFilter}".` : 'No hay productos cargados.'}</p>;
  }

  if (content) {
    return (
      <>
        {filterBar}
        {content}
      </>
    );
  }

  return (
    <>
      {filterBar}
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
