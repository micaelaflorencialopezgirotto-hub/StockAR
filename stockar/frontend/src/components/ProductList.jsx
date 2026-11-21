import { useEffect, useState } from 'react';
import { getAll as getProducts } from '../services/products.service.js';
import { getAll as getBrands } from '../services/brands.service.js';

const cell = { border: '1px solid #ddd', padding: '6px 8px', textAlign: 'left' };

export default function ProductList({ refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [brandNames, setBrandNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Cargando productos…</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (products.length === 0) return <p>No hay productos cargados.</p>;

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={cell}>Nombre</th>
          <th style={cell}>Código</th>
          <th style={cell}>Marca</th>
          <th style={cell}>Modelo</th>
          <th style={cell}>Descripción</th>
          <th style={cell}>Estado</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
