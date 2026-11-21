import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll as getProducts, remove, update } from '../services/products.service.js';
import { getAll as getBrands } from '../services/brands.service.js';
import { STOCK_STATUS, StatusPill, SuccessBadge, activeTone, stockStatus, useFlash } from './ui.jsx';

// Pestañas de estado: filtran en el front sobre la lista completa.
const TABS = [
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
  { value: 'todos', label: 'Todos' },
];

// onEdit(product): se eligió un producto para editar.
// onDeleted(product): se eliminó un producto (App refresca la lista).
// editingId: producto abierto en el formulario; no se puede activar/desactivar mientras se edita,
// porque al guardar el formulario se pisaría el estado.
export default function ProductList({ refreshTrigger, onEdit, onDeleted, editingId = null }) {
  const [products, setProducts] = useState([]);
  const [brandNames, setBrandNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [tab, setTab] = useState('todos');
  const [togglingId, setTogglingId] = useState(null);
  const [success, showSuccess] = useFlash();

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

  // Activa o desactiva el producto en el catálogo (campo estado_catalogo de la API).
  async function handleToggle(product) {
    const activating = product.estado_catalogo !== 'activo';
    const verb = activating ? 'Activar' : 'Desactivar';
    if (!window.confirm(`¿${verb} el producto "${product.nombre}"?`)) return;
    setTogglingId(product.id);
    setDeleteError(null);
    try {
      const saved = await update(product.id, { estado_catalogo: activating ? 'activo' : 'inactivo' });
      setProducts((list) => list.map((p) => (p.id === saved.id ? saved : p)));
      showSuccess(`"${saved.nombre}" ${activating ? 'activado' : 'desactivado'}`);
    } catch (err) {
      setDeleteError(err.response?.data?.data?.message || `No se pudo ${verb.toLowerCase()} el producto`);
    } finally {
      setTogglingId(null);
    }
  }

  const counts = {
    activo: products.filter((p) => p.estado_catalogo === 'activo').length,
    inactivo: products.filter((p) => p.estado_catalogo !== 'activo').length,
    todos: products.length,
  };
  const visible =
    tab === 'todos'
      ? products
      : products.filter((p) => (tab === 'activo' ? p.estado_catalogo === 'activo' : p.estado_catalogo !== 'activo'));

  // El filtro queda visible mientras carga, si hay error o si no hay resultados.
  const filterBar = (
    <div className="mb-space-md flex flex-wrap items-center justify-between gap-space-sm font-sans">
      <div role="tablist" aria-label="Filtrar por estado" className="inline-flex rounded-md border border-outline-variant bg-surface-container-low p-0.5">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 font-body-md text-body-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-secondary ${
              tab === t.value ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] ring-1 ring-outline-variant' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.label}
            {!loading && !error && (
              <span className="rounded bg-surface-container px-1.5 font-label-code text-label-code text-on-surface-variant">{counts[t.value]}</span>
            )}
          </button>
        ))}
      </div>
      <SuccessBadge message={success} />
    </div>
  );

  let content;
  if (loading) content = <p className="font-body-md text-body-md text-on-surface-variant">Cargando productos…</p>;
  else if (error) content = <p className="rounded border border-error-container bg-surface-container-lowest px-3 py-2 font-body-md text-body-md text-error">{error}</p>;
  else if (visible.length === 0) {
    content = (
      <p className="rounded border border-outline-variant bg-surface-container-lowest p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
        {products.length === 0
          ? 'No hay productos cargados.'
          : tab === 'activo'
            ? 'No hay productos activos.'
            : 'No hay productos inactivos.'}
      </p>
    );
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
      {deleteError && <p className="mb-space-md rounded border border-error-container bg-surface-container-lowest px-3 py-2 font-body-md text-body-md text-error">{deleteError}</p>}
      <ul className="grid font-sans grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <li key={p.id} className="flex flex-col overflow-hidden rounded border border-outline-variant bg-surface-container-lowest transition-colors hover:border-outline">
            <Link to={`/productos/${p.id}`} className="flex aspect-video items-center justify-center border-b border-outline-variant bg-surface-container-low">
              {p.imagen ? (
                <img src={p.imagen} alt={p.nombre} className="size-full object-contain" loading="lazy" />
              ) : (
                <span className="material-symbols-outlined text-[48px] text-outline-variant">image</span>
              )}
            </Link>
            <div className="flex flex-1 flex-col p-space-lg">
              <div className="flex items-start justify-between gap-space-sm">
                <span className="rounded border border-outline-variant bg-surface-container-low px-1.5 py-0.5 font-label-code text-label-code text-on-surface-variant">{p.sku}</span>
                <span className="flex flex-wrap justify-end gap-space-xs">
                  {stockStatus(p) !== 'normal' && (
                    <StatusPill tone={STOCK_STATUS[stockStatus(p)].tone}>{STOCK_STATUS[stockStatus(p)].label}</StatusPill>
                  )}
                  <StatusPill tone={activeTone(p.estado_catalogo)}>{p.estado_catalogo ?? '—'}</StatusPill>
                </span>
              </div>

              <h3 className="mt-space-sm font-headline-md text-headline-md text-on-surface">
                <Link to={`/productos/${p.id}`} className="hover:underline">{p.nombre}</Link>
              </h3>
              {p.descripcion_tecnica && (
                <p className="mt-space-xs line-clamp-3 font-body-md text-body-md text-on-surface-variant">{p.descripcion_tecnica}</p>
              )}

              {(p.codigo_barras || p.ubicacion) && (
                <div className="mt-space-sm flex flex-wrap gap-space-xs">
                  {p.codigo_barras && (
                    <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-low px-1.5 py-0.5 font-label-code text-label-code text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">barcode</span>
                      {p.codigo_barras}
                    </span>
                  )}
                  {p.ubicacion && (
                    <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-low px-1.5 py-0.5 font-label-code text-label-code text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">shelves</span>
                      {p.ubicacion}
                    </span>
                  )}
                </div>
              )}

              <dl className="mt-space-md grid grid-cols-3 gap-space-sm border-t border-surface-container-high pt-space-md">
                <div>
                  <dt className="font-label-caps text-label-caps uppercase text-outline">Stock actual</dt>
                  <dd className={`font-label-tabular text-label-tabular tabular-nums ${STOCK_STATUS[stockStatus(p)].text}`}>
                    {p.stock_actual != null ? `${p.stock_actual.toLocaleString('es-AR')} ${p.unidad_medida ?? ''}` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="font-label-caps text-label-caps uppercase text-outline">Stock mín.</dt>
                  <dd className="font-label-tabular text-label-tabular tabular-nums text-on-surface-variant">
                    {p.stock_minimo != null ? `${p.stock_minimo.toLocaleString('es-AR')} ${p.unidad_medida ?? ''}` : '—'}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="font-label-caps text-label-caps uppercase text-outline">Precio venta</dt>
                  <dd className="font-label-tabular text-label-tabular tabular-nums text-on-surface">
                    {p.precio_venta != null
                      ? p.precio_venta.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
                      : '—'}
                  </dd>
                </div>
              </dl>

              <dl className="mt-space-sm grid grid-cols-3 gap-space-sm">
                <div>
                  <dt className="font-label-caps text-label-caps uppercase text-outline">Marca</dt>
                  <dd className="truncate font-body-md text-body-md text-on-surface">{brandNames[p.marca_id] ?? '—'}</dd>
                </div>
                <div>
                  <dt className="font-label-caps text-label-caps uppercase text-outline">Modelo</dt>
                  <dd className="truncate font-body-md text-body-md text-on-surface">{p.modelo ?? '—'}</dd>
                </div>
                <div>
                  <dt className="font-label-caps text-label-caps uppercase text-outline">Unidad</dt>
                  <dd className="font-label-tabular text-label-tabular text-on-surface">{p.unidad_medida ?? '—'}</dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-wrap justify-end gap-space-sm pt-space-md">
                <button
                  type="button"
                  onClick={() => onEdit?.(p)}
                  className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(p)}
                  disabled={togglingId === p.id || editingId === p.id}
                  title={editingId === p.id ? 'Cerrá la edición para cambiar el estado' : undefined}
                  className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  <span className="material-symbols-outlined text-[16px]">{p.estado_catalogo === 'activo' ? 'toggle_off' : 'toggle_on'}</span>
                  {togglingId === p.id ? 'Guardando…' : p.estado_catalogo === 'activo' ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  disabled={deletingId === p.id}
                  className="inline-flex items-center gap-1 rounded border border-error-container bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-medium text-error hover:bg-error-container/40 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  {deletingId === p.id ? 'Eliminando…' : 'Eliminar'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
