import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getById as getProduct } from '../services/products.service.js';
import { getAll as getBrands } from '../services/brands.service.js';
import { getAll as getCategories } from '../services/categories.service.js';
import { getAll as getWarehouses } from '../services/warehouses.service.js';
import { getAll as getSuppliers } from '../services/suppliers.service.js';
import { getAll as getProductSuppliers } from '../services/productSuppliers.service.js';
import { getAll as getMovements } from '../services/movements.service.js';
import MovementsTable from '../components/MovementsTable.jsx';
import SupplierOffersTable from '../components/SupplierOffersTable.jsx';
import {
  STOCK_STATUS,
  StatusPill,
  card,
  codeBadge,
  errorClass,
  errorMessage,
  formatDateTime,
  formatMoney,
  formatQty,
  mutedText,
  pageTitle,
  sectionTitle,
  stockStatus,
} from '../components/ui.jsx';

const byDateDesc = (a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora);

function Metric({ label, children, hint, tone = 'text-on-surface' }) {
  return (
    <div className={`${card} p-space-lg`}>
      <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">{label}</p>
      <p className={`mt-space-xs font-headline-lg text-headline-lg tabular-nums ${tone}`}>{children}</p>
      {hint && <p className="mt-space-xs font-body-sm text-body-sm text-outline">{hint}</p>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex justify-between gap-space-md border-b border-surface-container-high py-2 last:border-b-0">
      <dt className="font-body-md text-body-md text-on-surface-variant">{label}</dt>
      <dd className="text-right font-body-md text-body-md text-on-surface">{children}</dd>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getProduct(id),
      getBrands(),
      getCategories(),
      getWarehouses(),
      getSuppliers(),
      getProductSuppliers({ producto_id: id }),
      getMovements({ producto_id: id }),
    ])
      .then(([product, brands, categories, warehouses, suppliers, offers, movements]) => {
        if (cancelled) return;
        setData({
          product,
          brand: brands.find((b) => b.id === product.marca_id),
          category: categories.find((c) => c.id === product.categoria_id),
          warehouse: warehouses.find((w) => w.id === product.deposito_id),
          suppliersById: Object.fromEntries(suppliers.map((s) => [s.id, s])),
          offers,
          movements: [...movements].sort(byDateDesc),
        });
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, 'No se pudo cargar el producto'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const backLink = (
    <Link to="/productos" className="mb-space-md inline-flex items-center gap-1 font-body-md text-body-md text-on-surface-variant hover:text-on-surface">
      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
      Productos
    </Link>
  );

  if (loading) return <>{backLink}<p className={mutedText}>Cargando producto…</p></>;
  if (error) return <>{backLink}<p className={errorClass}>{error}</p></>;

  const { product: p, brand, category, warehouse, suppliersById, offers, movements } = data;
  const unit = p.unidad_medida;
  const status = STOCK_STATUS[stockStatus(p)];
  const disponible = Number(p.stock_actual ?? 0) - Number(p.stock_reservado ?? 0);
  const specs = Object.entries(p.especificaciones ?? {});

  return (
    <div>
      {backLink}

      <header className="mb-space-lg flex flex-col gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-sm">
          <span className={codeBadge}>{p.sku}</span>
          <StatusPill dot={p.estado_catalogo === 'activo' ? 'bg-secondary' : 'bg-outline'}>{p.estado_catalogo ?? '—'}</StatusPill>
          {category && <span className="font-body-sm text-body-sm text-on-surface-variant">{category.nombre}</span>}
        </div>
        <h2 className={pageTitle}>{p.nombre}</h2>
        {p.descripcion_tecnica && <p className={mutedText}>{p.descripcion_tecnica}</p>}
      </header>

      <section className="mb-space-xl">
        <h3 className={`mb-space-md ${sectionTitle}`}>Stock en depósito propio</h3>
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Stock actual" tone={status.text} hint={status.label}>{formatQty(p.stock_actual, unit)}</Metric>
          <Metric label="Reservado">{formatQty(p.stock_reservado, unit)}</Metric>
          <Metric label="Disponible" hint="Actual menos reservado">{formatQty(disponible, unit)}</Metric>
          <Metric label="Stock mínimo">{formatQty(p.stock_minimo, unit)}</Metric>
        </div>
        <p className={`mt-space-sm ${mutedText}`}>
          {warehouse?.nombre ?? 'Sin depósito asignado'}
          {p.ubicacion && <> · <span className="font-label-code text-label-code">{p.ubicacion}</span></>}
        </p>
      </section>

      <div className="mb-space-xl grid grid-cols-1 gap-space-md lg:grid-cols-2">
        <section className={`${card} p-space-lg`}>
          <h3 className={`mb-space-sm ${sectionTitle}`}>Datos del producto</h3>
          <dl>
            <Field label="Marca">{brand?.nombre ?? '—'}</Field>
            <Field label="Modelo">{p.modelo ?? '—'}</Field>
            <Field label="Código de barras"><span className="font-label-code text-label-code">{p.codigo_barras ?? '—'}</span></Field>
            <Field label="Unidad de medida">{unit ?? '—'}</Field>
            <Field label="Unidades por paquete">{p.unidades_por_paquete ?? '—'}</Field>
            {specs.map(([key, value]) => (
              <Field key={key} label={key.replaceAll('_', ' ')}><span className="font-label-code text-label-code">{String(value)}</span></Field>
            ))}
          </dl>
        </section>

        <section className={`${card} p-space-lg`}>
          <h3 className={`mb-space-sm ${sectionTitle}`}>Precio de venta</h3>
          <dl>
            <Field label="Costo neto"><span className="font-label-tabular text-label-tabular">{formatMoney(p.costo_neto)}</span></Field>
            <Field label="Margen">{p.margen_pct != null ? `${p.margen_pct}%` : '—'}</Field>
            <Field label="Alícuota IVA">{p.alicuota_iva != null ? `${p.alicuota_iva}%` : '—'}</Field>
            <Field label="Precio de venta"><span className="font-label-tabular text-label-tabular font-semibold">{formatMoney(p.precio_venta)}</span></Field>
            <Field label="Actualizado"><span className="font-label-code text-label-code">{formatDateTime(p.precio_venta_actualizado_en)}</span></Field>
          </dl>
        </section>
      </div>

      <section className="mb-space-xl">
        <h3 className={`mb-space-xs ${sectionTitle}`}>Proveedores</h3>
        <p className={`mb-space-md ${mutedText}`}>Precio de lista y disponibilidad que informa cada proveedor. No es stock del depósito propio.</p>
        {offers.length === 0 ? (
          <p className={`${card} p-space-lg text-center ${mutedText}`}>Ningún proveedor tiene este producto en su lista.</p>
        ) : (
          <SupplierOffersTable offers={offers} suppliersById={suppliersById} />
        )}
      </section>

      <section>
        <h3 className={`mb-space-md ${sectionTitle}`}>Movimientos</h3>
        {movements.length === 0 ? (
          <p className={`${card} p-space-lg text-center ${mutedText}`}>Este producto no tiene movimientos.</p>
        ) : (
          <MovementsTable movements={movements} showProduct={false} />
        )}
      </section>
    </div>
  );
}
