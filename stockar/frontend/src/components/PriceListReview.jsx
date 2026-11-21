import { useEffect, useState } from 'react';
import { getAll as getItems } from '../services/priceListItems.service.js';
import { update as updateList } from '../services/priceLists.service.js';
import { applyPriceList } from '../lib/priceList.js';
import PriceListItemsTable from './PriceListItemsTable.jsx';
import { useConfirm } from './ConfirmDialog.jsx';
import { errorClass, errorMessage, mutedText, primaryButton, secondaryButton } from './ui.jsx';

// Revisión de una lista importada: asociar ítems sin asociar, aplicar o descartar.
// onChanged(): se aplicó o descartó (la página recarga listas y precios).
export default function PriceListReview({ list, supplier, products, onChanged, onClose }) {
  const [items, setItems] = useState([]);
  const [productChoices, setProductChoices] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [confirmDialog, confirm] = useConfirm();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getItems({ lista_precios_id: list.id })
      .then((data) => {
        if (!cancelled) setItems([...data].sort((a, b) => a.nro_fila - b.nro_fila));
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, 'No se pudieron cargar los ítems de la lista'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [list.id, refresh]);

  // Al cambiar de lista se descartan las elecciones de producto y el resultado anterior.
  useEffect(() => {
    setProductChoices({});
    setResult(null);
    setError(null);
  }, [list.id]);

  const pending = list.estado === 'pendiente_revision';

  async function handleApply() {
    const ok = await confirm({
      title: '¿Aplicar la lista?',
      message: 'Se actualizan los precios de lista del proveedor y quedan registrados en el historial.',
      confirmLabel: 'Aplicar lista',
      icon: 'done_all',
    });
    if (!ok) return;
    setWorking(true);
    setError(null);
    try {
      const res = await applyPriceList(list, items, { supplier, productChoices });
      setResult(res);
      setRefresh((n) => n + 1);
      onChanged?.();
    } catch (err) {
      setError(errorMessage(err, 'No se pudo aplicar la lista'));
    } finally {
      setWorking(false);
    }
  }

  async function handleDiscard() {
    const ok = await confirm({
      title: '¿Descartar la lista?',
      message: 'No se aplica ningún precio. La lista queda marcada como descartada.',
      confirmLabel: 'Descartar',
      tone: 'danger',
      icon: 'block',
    });
    if (!ok) return;
    setWorking(true);
    setError(null);
    try {
      await updateList(list.id, { estado: 'descartada' });
      onChanged?.();
    } catch (err) {
      setError(errorMessage(err, 'No se pudo descartar la lista'));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-space-md">
      {confirmDialog}
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <p className={mutedText}>
          <span className="font-label-code text-label-code text-on-surface">{list.archivo_nombre}</span>
          {pending ? ' · Asociá los ítems sin asociar que quieras sumar y aplicá la lista.' : ''}
        </p>
        <div className="flex gap-space-sm">
          <button type="button" onClick={onClose} disabled={working} className={`${secondaryButton} px-4 py-2`}>
            Cerrar
          </button>
          {pending && (
            <>
              <button type="button" onClick={handleDiscard} disabled={working} className={`${secondaryButton} border-error-container px-4 py-2 text-error`}>
                Descartar
              </button>
              <button type="button" onClick={handleApply} disabled={working || loading} className={primaryButton}>
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                {working ? 'Aplicando…' : 'Aplicar lista'}
              </button>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className={result.errors.length ? errorClass : `rounded border border-outline-variant bg-surface-container-low px-3 py-2 ${mutedText}`}>
          <p>
            {result.applied} ítems aplicados · {result.skipped} sin aplicar (errores o sin asociar).
            {result.errors.length > 0 && ` ${result.errors.length} fallaron; la lista sigue pendiente y podés volver a aplicarla.`}
          </p>
          {result.errors.map(({ item, message }) => (
            <p key={item.id}>Fila {item.nro_fila}: {message}</p>
          ))}
        </div>
      )}
      {error && <p className={errorClass}>{error}</p>}

      {loading ? (
        <p className={mutedText}>Cargando ítems…</p>
      ) : (
        <PriceListItemsTable
          items={items}
          currency={supplier?.moneda_lista}
          products={products}
          productChoices={productChoices}
          onChoose={pending ? (itemId, productId) => setProductChoices({ ...productChoices, [itemId]: productId }) : undefined}
        />
      )}
    </div>
  );
}
