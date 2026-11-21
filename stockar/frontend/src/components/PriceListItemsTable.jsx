import { SelectIcon, StatusPill, card, codeBadge, formatMoney, selectClass, td, tdNum, th } from './ui.jsx';

export const CHANGE_TYPES = {
  precio: { label: 'Cambio de precio', dot: 'bg-secondary' },
  sin_cambio: { label: 'Sin cambio', dot: 'bg-outline' },
  nuevo: { label: 'Sin asociar', dot: 'bg-on-tertiary-container' },
  error: { label: 'Error', dot: 'bg-error' },
};

// items: filas de una lista (vista previa o ya guardadas).
// Para revisar una lista guardada: products, productChoices y onChoose permiten asociar los ítems sin asociar a un producto.
export default function PriceListItemsTable({ items, currency = 'ARS', products, productChoices = {}, onChoose }) {
  const reviewing = Boolean(onChoose);

  return (
    <div className={`overflow-x-auto ${card}`}>
      <table className="w-full border-collapse text-left">
        <thead className="border-b border-outline-variant bg-surface-container-low">
          <tr>
            <th className={`${th} text-right`}>Fila</th>
            <th className={th}>Código</th>
            <th className={th}>Descripción</th>
            <th className={`${th} text-right`}>Precio anterior</th>
            <th className={`${th} text-right`}>Precio nuevo</th>
            <th className={`${th} text-right`}>Variación</th>
            <th className={th}>Resultado</th>
            {reviewing && <th className={th}>Producto</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const type = CHANGE_TYPES[item.tipo_cambio] ?? { label: item.tipo_cambio, dot: 'bg-outline' };
            const variation =
              item.precio_anterior && item.precio_nuevo ? (item.precio_nuevo / item.precio_anterior - 1) * 100 : null;
            return (
              <tr key={item.id ?? item.nro_fila} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                <td className={`${tdNum} text-on-surface-variant`}>{item.nro_fila}</td>
                <td className={td}>{item.codigo_proveedor ? <span className={codeBadge}>{item.codigo_proveedor}</span> : '—'}</td>
                <td className={td}>
                  {item.descripcion ?? '—'}
                  {item.mensaje_error && <span className="block font-body-sm text-body-sm text-error">{item.mensaje_error}</span>}
                </td>
                <td className={`${tdNum} text-on-surface-variant`}>{formatMoney(item.precio_anterior, currency)}</td>
                <td className={tdNum}>{formatMoney(item.precio_nuevo, currency)}</td>
                <td className={`${tdNum} ${variation > 0 ? 'text-error' : variation < 0 ? 'text-secondary' : 'text-on-surface-variant'}`}>
                  {variation == null ? '—' : `${variation > 0 ? '+' : ''}${variation.toLocaleString('es-AR', { maximumFractionDigits: 1 })}%`}
                </td>
                <td className={td}>
                  <span className="flex flex-col items-start gap-1">
                    <StatusPill dot={type.dot}>{type.label}</StatusPill>
                    {item.resuelto && item.tipo_cambio !== 'sin_cambio' && (
                      <span className="font-body-sm text-body-sm text-outline">Aplicado</span>
                    )}
                  </span>
                </td>
                {reviewing && (
                  <td className={`${td} min-w-56`}>
                    {item.tipo_cambio === 'nuevo' && !item.resuelto ? (
                      <span className="relative block">
                        <select value={productChoices[item.id] ?? ''} onChange={(e) => onChoose(item.id, e.target.value)} className={selectClass}>
                          <option value="">— No asociar —</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.sku} · {p.nombre}</option>
                          ))}
                        </select>
                        <SelectIcon />
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
