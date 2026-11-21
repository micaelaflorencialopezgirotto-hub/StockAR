import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll as getProductSuppliers } from '../services/productSuppliers.service.js';
import { getAll as getProducts } from '../services/products.service.js';
import { getAll as getSuppliers } from '../services/suppliers.service.js';
import SupplierOffersTable from './SupplierOffersTable.jsx';
import { EmptyState, ErrorState, LoadingState, codeBadge, formatQty } from './ui.jsx';

// Para cada producto con listas de proveedores, compara precio de lista y disponibilidad informada.
// refreshTrigger: cambia cuando se crea, edita o borra un proveedor.
export default function PriceComparison({ refreshTrigger }) {
  const [groups, setGroups] = useState([]);
  const [suppliersById, setSuppliersById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); // "Reintentar" lo incrementa y vuelve a pedir los datos

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    Promise.all([getProductSuppliers(), getProducts(), getSuppliers()])
      .then(([offers, products, suppliers]) => {
        if (cancelled) return;
        const byProduct = {};
        for (const o of offers) (byProduct[o.producto_id] ??= []).push(o);
        const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
        setGroups(
          Object.entries(byProduct)
            .map(([productId, productOffers]) => ({ product: productsById[productId], productId, offers: productOffers }))
            .sort((a, b) => (a.product?.nombre ?? '').localeCompare(b.product?.nombre ?? ''))
        );
        setSuppliersById(Object.fromEntries(suppliers.map((s) => [s.id, s])));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshTrigger, reloadKey]);

  if (loading) return <LoadingState message="Cargando comparador de precios…" />;
  if (error) {
    return <ErrorState message="No se pudo cargar el comparador de precios. Intentá de nuevo." onRetry={() => setReloadKey((k) => k + 1)} />;
  }
  if (groups.length === 0) {
    return (
      <EmptyState
        icon="balance"
        message="Todavía no hay productos en listas de proveedores. Cargá precios en Listas de precios."
      />
    );
  }

  return (
    <div className="space-y-space-lg">
      {groups.map(({ product, productId, offers }) => (
        <div key={productId}>
          <div className="mb-space-sm flex flex-wrap items-baseline justify-between gap-space-sm">
            <div className="flex flex-wrap items-baseline gap-space-sm">
              {product ? (
                <>
                  <span className={codeBadge}>{product.sku}</span>
                  <Link to={`/productos/${productId}`} className="font-body-lg text-body-lg font-medium text-on-surface hover:underline">
                    {product.nombre}
                  </Link>
                </>
              ) : (
                <span className={codeBadge}>{productId}</span>
              )}
            </div>
            {product && (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Stock en depósito propio:{' '}
                <span className="font-label-code text-label-code text-on-surface">{formatQty(product.stock_actual, product.unidad_medida)}</span>
              </span>
            )}
          </div>
          <SupplierOffersTable offers={offers} suppliersById={suppliersById} />
        </div>
      ))}
    </div>
  );
}
