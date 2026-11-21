import { Link } from 'react-router-dom';
import { MOVEMENT_TYPES, card, codeBadge, formatDateTime, formatMoney, isReservation, td, tdNum, th } from './ui.jsx';

// movements: ya ordenados. productsById: { id: producto } para mostrar SKU y nombre.
// showProduct: false en la ficha de producto, donde la columna sobra.
export default function MovementsTable({ movements, productsById = {}, showProduct = true }) {
  return (
    <div className={`overflow-x-auto ${card}`}>
      <table className="w-full border-collapse text-left">
        <thead className="border-b border-outline-variant bg-surface-container-low">
          <tr>
            <th className={th}>Fecha</th>
            <th className={th}>Tipo</th>
            {showProduct && <th className={th}>Producto</th>}
            <th className={`${th} text-right`}>Variación</th>
            <th className={`${th} text-right`}>Saldo</th>
            <th className={`${th} text-right`}>Costo unit.</th>
            <th className={th}>Comprobante</th>
            <th className={th}>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => {
            const product = productsById[m.producto_id];
            const reservation = isReservation(m.tipo);
            return (
              <tr key={m.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                <td className={`${td} whitespace-nowrap font-label-code text-label-code`}>{formatDateTime(m.fecha_hora)}</td>
                <td className={`${td} whitespace-nowrap`}>{MOVEMENT_TYPES[m.tipo]?.label ?? m.tipo}</td>
                {showProduct && (
                  <td className={td}>
                    {product ? (
                      <Link to={`/productos/${product.id}`} className="group flex flex-col">
                        <span className="font-medium text-on-surface group-hover:underline">{product.nombre}</span>
                        <span className="font-label-code text-label-code">{product.sku}</span>
                      </Link>
                    ) : (
                      <span className="font-label-code text-label-code">{m.producto_id}</span>
                    )}
                  </td>
                )}
                <td className={`${tdNum} ${reservation ? 'text-on-surface-variant' : m.cantidad < 0 ? 'text-error' : 'text-secondary'}`}>
                  {m.cantidad > 0 ? '+' : ''}
                  {Number(m.cantidad).toLocaleString('es-AR')}
                  {reservation && <span className="ml-1 font-body-sm text-body-sm">reservado</span>}
                </td>
                <td className={tdNum}>{m.saldo_posterior != null ? Number(m.saldo_posterior).toLocaleString('es-AR') : '—'}</td>
                <td className={tdNum}>{formatMoney(m.costo_unitario)}</td>
                <td className={td}>{m.comprobante_ref ? <span className={codeBadge}>{m.comprobante_ref}</span> : '—'}</td>
                <td className={td}>{m.detalle ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
