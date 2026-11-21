import { useEffect, useState } from 'react';
import { create as createList } from '../services/priceLists.service.js';
import { create as createItem } from '../services/priceListItems.service.js';
import { buildItems, parseCsv, summarize } from '../lib/priceList.js';
import PriceListItemsTable from './PriceListItemsTable.jsx';
import { card, errorClass, errorMessage, fieldClass, inputClass, labelClass, mutedText, primaryButton, secondaryButton } from './ui.jsx';

const DEFAULT_MAPPING = { codigo: 'A', descripcion: 'B', precio: 'C' };
const today = () => new Date().toISOString().slice(0, 10);

function supplierMapping(supplier) {
  return { ...DEFAULT_MAPPING, ...(supplier?.mapeo_columnas ?? {}) };
}

// Lee un CSV del proveedor, muestra la vista previa y la guarda como lista pendiente de revisión.
// offers: lo que el proveedor ya tiene cargado, para detectar cambios de precio por código.
export default function PriceListImport({ supplier, offers, onImported }) {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState(null);
  const [mapping, setMapping] = useState(() => supplierMapping(supplier));
  const [hasHeader, setHasHeader] = useState(true);
  const [fechaVigencia, setFechaVigencia] = useState(today);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [inputKey, setInputKey] = useState(0); // para vaciar el <input type="file">

  useEffect(() => {
    setMapping(supplierMapping(supplier));
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier?.id]);

  function reset() {
    setFile(null);
    setRows(null);
    setError(null);
    setInputKey((k) => k + 1);
  }

  async function handleFile(e) {
    const selected = e.target.files?.[0];
    setError(null);
    setRows(null);
    setFile(selected ?? null);
    if (!selected) return;
    try {
      setRows(parseCsv(await selected.text()));
    } catch {
      setError('No se pudo leer el archivo');
    }
  }

  const items = rows ? buildItems(rows, mapping, offers, hasHeader) : [];
  const summary = summarize(items);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const list = await createList({
        proveedor_id: supplier.id,
        archivo_nombre: file.name,
        formato: 'csv',
        fecha_vigencia: fechaVigencia || null,
        estado: 'pendiente_revision',
        ...summary,
      });
      for (const item of items) {
        await createItem({ ...item, lista_precios_id: list.id, resuelto: item.tipo_cambio === 'sin_cambio' });
      }
      reset();
      onImported?.(list);
    } catch (err) {
      setError(errorMessage(err, 'No se pudo guardar la lista'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-space-md">
      <section className={`${card} p-space-lg`}>
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-6">
          <label className={`${fieldClass} md:col-span-2`}>
            <span className={labelClass}>Archivo CSV <span className="text-error">*</span></span>
            <input
              key={inputKey}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="font-body-md text-body-md text-on-surface-variant file:mr-space-sm file:rounded file:border file:border-outline-variant file:bg-surface-container-lowest file:px-3 file:py-1.5 file:font-body-sm file:text-body-sm file:font-medium file:text-on-surface hover:file:bg-surface-container-low"
            />
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Vigente desde</span>
            <input type="date" value={fechaVigencia} onChange={(e) => setFechaVigencia(e.target.value)} className={`${inputClass} font-label-code text-label-code`} />
          </label>

          {['codigo', 'descripcion', 'precio'].map((key) => (
            <label key={key} className={fieldClass}>
              <span className={labelClass}>Columna {key === 'codigo' ? 'código' : key === 'descripcion' ? 'descripción' : 'precio'}</span>
              <input
                value={mapping[key] ?? ''}
                onChange={(e) => setMapping({ ...mapping, [key]: e.target.value.toUpperCase() })}
                maxLength={2}
                className={`${inputClass} text-center font-label-code text-label-code uppercase`}
              />
            </label>
          ))}

          <label className="flex items-center gap-space-sm md:col-span-6">
            <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="size-4 accent-primary" />
            <span className="font-body-md text-body-md text-on-surface">La primera fila es el encabezado</span>
          </label>
        </div>
        <p className={`mt-space-sm font-body-sm text-body-sm text-outline`}>
          Columnas como en Excel (A, B, C…). Separador coma o punto y coma. Precios con formato 1.234,56 o 1234.56.
        </p>
      </section>

      {error && <p className={errorClass}>{error}</p>}

      {rows && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <p className={mutedText}>
              {summary.total_filas} filas · {summary.filas_con_cambio} con cambio de precio · {summary.filas_nuevas} sin asociar ·{' '}
              <span className={summary.filas_error ? 'text-error' : ''}>{summary.filas_error} con error</span>
            </p>
            <div className="flex gap-space-sm">
              <button type="button" onClick={reset} disabled={saving} className={`${secondaryButton} px-4 py-2`}>
                Cancelar
              </button>
              <button type="button" onClick={handleSave} disabled={saving || items.length === 0} className={primaryButton}>
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                {saving ? 'Guardando…' : 'Guardar para revisión'}
              </button>
            </div>
          </div>
          {items.length > 0 && <PriceListItemsTable items={items} currency={supplier?.moneda_lista} />}
        </>
      )}
    </div>
  );
}
