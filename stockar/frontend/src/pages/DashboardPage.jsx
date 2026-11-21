import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll as getProducts } from '../services/products.service.js';
import { getAll as getSuppliers } from '../services/suppliers.service.js';
import { getAll as getMovements } from '../services/movements.service.js';
import MovementsTable from '../components/MovementsTable.jsx';
import {
  STOCK_STATUS,
  StatusPill,
  card,
  codeBadge,
  errorClass,
  errorMessage,
  formatMoney,
  formatQty,
  mutedText,
  pageTitle,
  sectionTitle,
  stockStatus,
  td,
  tdNum,
  th,
} from '../components/ui.jsx';

const RECENT_MOVEMENTS = 5;

function MetricCard({ label, icon, value, hint, tone = 'text-on-surface' }) {
  return (
    <div className={`${card} p-space-lg`}>
      <div className="flex items-start justify-between gap-space-sm">
        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">{label}</p>
        <span className="material-symbols-outlined text-[20px] text-outline">{icon}</span>
      </div>
      <p className={`mt-space-sm font-headline-lg text-headline-lg tabular-nums ${tone}`}>{value}</p>
      {hint && <p className="mt-space-xs font-body-sm text-body-sm text-outline">{hint}</p>}
    </div>
  );
}

// Todas las métricas se calculan en el front con los datos de la API.
export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProducts(), getSuppliers(), getMovements()])
      .then(([products, suppliers, movements]) => {
        if (!cancelled) setData({ products, suppliers, movements });
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, 'No se pudo cargar el resumen'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className={mutedText}>Cargando resumen…</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  const { products, suppliers, movements } = data;
  const counts = { normal: 0, bajo: 0, sin_stock: 0 };
  for (const p of products) counts[stockStatus(p)] += 1;
  const valuation = products.reduce((sum, p) => sum + Number(p.stock_actual ?? 0) * Number(p.costo_neto ?? 0), 0);
  const activeSuppliers = suppliers.filter((s) => s.estado === 'activo').length;
  const restock = products
    .filter((p) => stockStatus(p) !== 'normal')
    .sort((a, b) => Number(a.stock_actual ?? 0) - Number(b.stock_actual ?? 0));
  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
  const recent = [...movements].sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)).slice(0, RECENT_MOVEMENTS);

  return (
    <div className="space-y-space-xl">
      <section>
        <h2 className={`mb-space-md ${pageTitle}`}>Resumen</h2>
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Productos" icon="inventory_2" value={products.length.toLocaleString('es-AR')} hint="En el catálogo" />
          <MetricCard label="Stock normal" icon="check_circle" value={counts.normal.toLocaleString('es-AR')} hint="Sobre el mínimo" />
          <MetricCard label="Stock bajo" icon="warning" value={counts.bajo.toLocaleString('es-AR')} hint="En o bajo el mínimo" tone={counts.bajo ? STOCK_STATUS.bajo.text : undefined} />
          <MetricCard label="Sin stock" icon="error_outline" value={counts.sin_stock.toLocaleString('es-AR')} hint="Stock actual en 0" tone={counts.sin_stock ? STOCK_STATUS.sin_stock.text : undefined} />
          <MetricCard label="Proveedores" icon="badge" value={activeSuppliers.toLocaleString('es-AR')} hint={`Activos de ${suppliers.length}`} />
          <MetricCard label="Valuación" icon="account_balance_wallet" value={formatMoney(valuation)} hint="Stock × costo neto" />
        </div>
      </section>

      <section>
        <h3 className={`mb-space-xs ${sectionTitle}`}>Reposición</h3>
        <p className={`mb-space-md ${mutedText}`}>Productos del depósito propio en o bajo su stock mínimo.</p>
        {restock.length === 0 ? (
          <p className={`${card} p-space-lg text-center ${mutedText}`}>Todos los productos están sobre el mínimo.</p>
        ) : (
          <div className={`overflow-x-auto ${card}`}>
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className={th}>Producto</th>
                  <th className={`${th} text-right`}>Stock actual</th>
                  <th className={`${th} text-right`}>Mínimo</th>
                  <th className={th}>Estado</th>
                  <th className={th}>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {restock.map((p) => {
                  const status = STOCK_STATUS[stockStatus(p)];
                  return (
                    <tr key={p.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                      <td className={td}>
                        <Link to={`/productos/${p.id}`} className="group flex flex-col">
                          <span className="font-medium text-on-surface group-hover:underline">{p.nombre}</span>
                          <span className="font-label-code text-label-code">{p.sku}</span>
                        </Link>
                      </td>
                      <td className={`${tdNum} ${status.text}`}>{formatQty(p.stock_actual, p.unidad_medida)}</td>
                      <td className={`${tdNum} text-on-surface-variant`}>{formatQty(p.stock_minimo, p.unidad_medida)}</td>
                      <td className={td}><StatusPill dot={status.dot}>{status.label}</StatusPill></td>
                      <td className={td}>{p.ubicacion ? <span className={codeBadge}>{p.ubicacion}</span> : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="mb-space-md flex items-baseline justify-between gap-space-sm">
          <h3 className={sectionTitle}>Últimos movimientos</h3>
          <Link to="/movimientos" className="font-body-md text-body-md font-medium text-secondary hover:underline">Ver todos</Link>
        </div>
        {recent.length === 0 ? (
          <p className={`${card} p-space-lg text-center ${mutedText}`}>No hay movimientos registrados.</p>
        ) : (
          <MovementsTable movements={recent} productsById={productsById} />
        )}
      </section>
    </div>
  );
}
