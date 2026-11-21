import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll as getSuppliers } from '../services/suppliers.service.js';
import { getAll as getProducts } from '../services/products.service.js';
import { getAll as getProductSuppliers } from '../services/productSuppliers.service.js';
import { getAll as getPriceLists } from '../services/priceLists.service.js';
import ProductSupplierForm from '../components/ProductSupplierForm.jsx';
import PriceListImport from '../components/PriceListImport.jsx';
import PriceListReview from '../components/PriceListReview.jsx';
import {
  SelectIcon,
  StatusPill,
  activeTone,
  card,
  codeBadge,
  errorClass,
  errorMessage,
  formatDate,
  formatDateTime,
  formatMoney,
  mutedText,
  PageHeader,
  secondaryButton,
  sectionTitle,
  selectClass,
  td,
  tdNum,
  tdNumBase,
  th,
} from '../components/ui.jsx';

const LIST_STATES = {
  pendiente_revision: { label: 'Pendiente de revisión', tone: 'warning' },
  aplicada: { label: 'Aplicada', tone: 'success' },
  descartada: { label: 'Descartada', tone: 'idle' },
};

export default function PriceListsPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [offers, setOffers] = useState([]);
  const [lists, setLists] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [reviewingListId, setReviewingListId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loadingBase, setLoadingBase] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = () => setRefresh((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSuppliers(), getProducts()])
      .then(([suppliersData, productsData]) => {
        if (cancelled) return;
        setSuppliers(suppliersData);
        setProducts(productsData);
        setSupplierId((current) => current || suppliersData.find((s) => s.estado === 'activo')?.id || suppliersData[0]?.id || '');
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, 'No se pudieron cargar proveedores y productos'));
      })
      .finally(() => {
        if (!cancelled) setLoadingBase(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!supplierId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getProductSuppliers({ proveedor_id: supplierId }), getPriceLists({ proveedor_id: supplierId })])
      .then(([offersData, listsData]) => {
        if (cancelled) return;
        setOffers(offersData);
        setLists([...listsData].sort((a, b) => new Date(b.importada_en) - new Date(a.importada_en)));
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, 'No se pudieron cargar los precios del proveedor'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [supplierId, refresh]);

  function changeSupplier(id) {
    setSupplierId(id);
    setEditingOffer(null);
    setReviewingListId(null);
  }

  if (loadingBase) return <p className={mutedText}>Cargando…</p>;
  if (suppliers.length === 0) {
    return (
      <p className={`${card} p-space-lg text-center ${mutedText}`}>
        No hay proveedores. <Link to="/proveedores" className="text-info hover:underline">Cargá uno</Link> para empezar.
      </p>
    );
  }

  const supplier = suppliers.find((s) => s.id === supplierId);
  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
  const reviewingList = lists.find((l) => l.id === reviewingListId);
  const sortedOffers = [...offers].sort((a, b) => (productsById[a.producto_id]?.nombre ?? '').localeCompare(productsById[b.producto_id]?.nombre ?? ''));

  return (
    <div className="space-y-space-xl">
      <PageHeader
        title="Listas de precios"
        description="Precios de lista y disponibilidad que informa cada proveedor. Cargalos a mano o importá la lista del proveedor en CSV."
        actions={
          <label className="flex items-center gap-space-sm">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Proveedor</span>
            <span className="relative">
              <select value={supplierId} onChange={(e) => changeSupplier(e.target.value)} className={`${selectClass} w-auto min-w-64`}>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.razon_social}{s.estado === 'activo' ? '' : ' (inactivo)'}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
          </label>
        }
      />

      {error && <p className={errorClass}>{error}</p>}

      <section id="product-supplier-form" className="scroll-mt-20">
        <h3 className={`mb-space-md ${sectionTitle}`}>
          {editingOffer ? `Editar precio: ${productsById[editingOffer.producto_id]?.nombre ?? editingOffer.codigo_proveedor}` : 'Cargar precio a mano'}
        </h3>
        <ProductSupplierForm
          supplier={supplier}
          products={products}
          offer={editingOffer}
          onSaved={() => {
            setEditingOffer(null);
            reload();
          }}
          onCancel={() => setEditingOffer(null)}
        />
      </section>

      <section>
        <h3 className={`mb-space-md ${sectionTitle}`}>Precios cargados</h3>
        {loading ? (
          <p className={mutedText}>Cargando precios…</p>
        ) : sortedOffers.length === 0 ? (
          <p className={`${card} p-space-lg text-center ${mutedText}`}>Este proveedor todavía no tiene productos en su lista.</p>
        ) : (
          <div className={`overflow-x-auto ${card}`}>
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className={th}>Producto</th>
                  <th className={th}>Código prov.</th>
                  <th className={`${th} text-right`}>Precio lista</th>
                  <th className={`${th} text-right`}>Disponibilidad prov.</th>
                  <th className={th}>Actualizado</th>
                  <th className={th}>Estado</th>
                  <th className={`${th} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedOffers.map((o) => {
                  const product = productsById[o.producto_id];
                  return (
                    <tr key={o.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                      <td className={td}>
                        {product ? (
                          <Link to={`/productos/${product.id}`} className="group flex flex-col">
                            <span className="font-medium text-on-surface group-hover:underline">{product.nombre}</span>
                            <span className="font-label-code text-label-code">{product.sku}</span>
                          </Link>
                        ) : (
                          o.producto_id
                        )}
                      </td>
                      <td className={td}><span className={codeBadge}>{o.codigo_proveedor}</span></td>
                      <td className={tdNum}>{formatMoney(o.precio_lista, o.moneda)}</td>
                      <td className={tdNum}>{o.stock_proveedor != null ? Number(o.stock_proveedor).toLocaleString('es-AR') : 'Sin dato'}</td>
                      <td className={`${td} font-label-code text-label-code`}>{formatDate(o.precio_actualizado_en)}</td>
                      <td className={td}><StatusPill tone={activeTone(o.activo)}>{o.activo ? 'activo' : 'inactivo'}</StatusPill></td>
                      <td className={`${td} text-right`}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingOffer(o);
                            document.getElementById('product-supplier-form')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={secondaryButton}
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className={`mb-space-xs ${sectionTitle}`}>Importar lista CSV</h3>
        <p className={`mb-space-md ${mutedText}`}>
          Se cruza por código de proveedor. La lista queda pendiente de revisión y los precios cambian recién al aplicarla.
        </p>
        <PriceListImport
          supplier={supplier}
          offers={offers}
          onImported={(list) => {
            setReviewingListId(list.id);
            reload();
          }}
        />
      </section>

      <section id="price-lists">
        <h3 className={`mb-space-md ${sectionTitle}`}>Listas importadas</h3>
        {lists.length === 0 ? (
          <p className={`${card} p-space-lg text-center ${mutedText}`}>No hay listas importadas para este proveedor.</p>
        ) : (
          <div className={`overflow-x-auto ${card}`}>
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className={th}>Archivo</th>
                  <th className={th}>Importada</th>
                  <th className={th}>Vigente desde</th>
                  <th className={`${th} text-right`}>Filas</th>
                  <th className={`${th} text-right`}>Cambios</th>
                  <th className={`${th} text-right`}>Sin asociar</th>
                  <th className={`${th} text-right`}>Errores</th>
                  <th className={th}>Estado</th>
                  <th className={`${th} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lists.map((l) => {
                  const state = LIST_STATES[l.estado] ?? { label: l.estado, tone: 'idle' };
                  return (
                    <tr key={l.id} className={`border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low ${l.id === reviewingListId ? 'bg-surface-container-low' : ''}`}>
                      <td className={td}><span className="font-label-code text-label-code text-on-surface">{l.archivo_nombre}</span></td>
                      <td className={`${td} font-label-code text-label-code`}>{formatDateTime(l.importada_en)}</td>
                      <td className={`${td} font-label-code text-label-code`}>{formatDate(l.fecha_vigencia && `${l.fecha_vigencia}T00:00:00`)}</td>
                      <td className={tdNum}>{l.total_filas}</td>
                      <td className={tdNum}>{l.filas_con_cambio}</td>
                      <td className={tdNum}>{l.filas_nuevas}</td>
                      <td className={`${tdNumBase} ${l.filas_error ? 'text-on-danger-container' : 'text-on-surface'}`}>{l.filas_error}</td>
                      <td className={td}><StatusPill tone={state.tone}>{state.label}</StatusPill></td>
                      <td className={`${td} text-right`}>
                        <button type="button" onClick={() => setReviewingListId(l.id)} className={secondaryButton}>
                          <span className="material-symbols-outlined text-[16px]">{l.estado === 'pendiente_revision' ? 'fact_check' : 'visibility'}</span>
                          {l.estado === 'pendiente_revision' ? 'Revisar' : 'Ver'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {reviewingList && (
        <section>
          <h3 className={`mb-space-md ${sectionTitle}`}>Revisión de lista</h3>
          <PriceListReview
            list={reviewingList}
            supplier={supplier}
            products={products}
            onChanged={reload}
            onClose={() => setReviewingListId(null)}
          />
        </section>
      )}
    </div>
  );
}
