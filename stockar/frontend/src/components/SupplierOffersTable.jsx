import { StatusPill, activeTone, card, codeBadge, formatDate, formatMoney, td, tdNum, th } from './ui.jsx';

// Menor precio de lista activo por moneda: solo se comparan precios en la misma moneda.
function bestPrices(offers) {
  const best = {};
  for (const o of offers) {
    if (!o.activo || o.precio_lista == null) continue;
    if (best[o.moneda] == null || o.precio_lista < best[o.moneda]) best[o.moneda] = o.precio_lista;
  }
  return best;
}

// offers: filas de /api/product-suppliers de un mismo producto.
// "Disponibilidad" es el stock que informa el proveedor (stock_proveedor), no el del depósito propio.
export default function SupplierOffersTable({ offers, suppliersById }) {
  const best = bestPrices(offers);
  const sorted = [...offers].sort((a, b) => Number(b.activo) - Number(a.activo) || (a.precio_lista ?? Infinity) - (b.precio_lista ?? Infinity));

  return (
    <div className={`overflow-x-auto ${card}`}>
      <table className="w-full border-collapse text-left">
        <thead className="border-b border-outline-variant bg-surface-container-low">
          <tr>
            <th className={th}>Proveedor</th>
            <th className={th}>Código prov.</th>
            <th className={`${th} text-right`}>Precio lista</th>
            <th className={`${th} text-right`}>vs. mejor</th>
            <th className={`${th} text-right`}>Disponibilidad prov.</th>
            <th className={th}>Actualizado</th>
            <th className={th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((o) => {
            const supplier = suppliersById[o.proveedor_id];
            const isBest = o.activo && o.precio_lista != null && o.precio_lista === best[o.moneda];
            const diff = o.activo && o.precio_lista != null && best[o.moneda] ? (o.precio_lista / best[o.moneda] - 1) * 100 : null;
            return (
              <tr key={o.id} className={`border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low ${o.activo ? '' : 'opacity-60'}`}>
                <td className={td}>
                  <span className="flex flex-col">
                    <span className="font-medium text-on-surface">{supplier?.razon_social ?? o.proveedor_id}</span>
                    {supplier?.plazo_entrega_hs != null && (
                      <span className="font-body-sm text-body-sm text-outline">Entrega {supplier.plazo_entrega_hs} hs</span>
                    )}
                  </span>
                </td>
                <td className={td}>{o.codigo_proveedor ? <span className={codeBadge}>{o.codigo_proveedor}</span> : '—'}</td>
                <td className={tdNum}>
                  {formatMoney(o.precio_lista, o.moneda)}
                  {o.descuento_pct_propio != null && (
                    <span className="block font-body-sm text-body-sm text-outline">Desc. {o.descuento_pct_propio}%</span>
                  )}
                </td>
                <td className={tdNum}>
                  {isBest ? (
                    <span className="inline-flex items-center gap-1 font-body-sm text-body-sm font-medium text-on-success-container">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Mejor precio
                    </span>
                  ) : diff != null ? (
                    <span className="text-on-danger-container">+{diff.toLocaleString('es-AR', { maximumFractionDigits: 1 })}%</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className={tdNum}>{o.stock_proveedor != null ? Number(o.stock_proveedor).toLocaleString('es-AR') : 'Sin dato'}</td>
                <td className={`${td} font-label-code text-label-code`}>{formatDate(o.precio_actualizado_en)}</td>
                <td className={td}>
                  <StatusPill tone={activeTone(o.activo)}>{o.activo ? 'activo' : 'inactivo'}</StatusPill>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
