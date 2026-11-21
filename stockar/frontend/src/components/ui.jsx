// Clases, formatos y piezas chicas compartidas por las pantallas nuevas.

export const card = 'rounded border border-outline-variant bg-surface-container-lowest';
export const fieldClass = 'flex flex-col gap-1.5';
export const labelClass = 'font-body-sm text-body-sm font-medium text-on-surface-variant';
export const inputClass =
  'h-9 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none';
export const selectClass = `${inputClass} appearance-none pr-8`;
export const errorClass =
  'rounded border border-error-container bg-surface-container-lowest px-3 py-2 font-body-md text-body-md text-error';
export const mutedText = 'font-body-md text-body-md text-on-surface-variant';
export const pageTitle = 'font-headline-lg text-headline-lg text-on-surface';
export const sectionTitle = 'font-headline-md text-headline-md text-on-surface';
export const th = 'whitespace-nowrap px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant';
export const td = 'px-4 py-3 font-body-md text-body-md text-on-surface-variant';
export const tdNum = 'px-4 py-3 text-right font-label-tabular text-label-tabular tabular-nums text-on-surface';
export const primaryButton =
  'inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 font-body-md text-body-md font-medium text-on-primary hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary';
export const secondaryButton =
  'inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary';
export const codeBadge =
  'inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-low px-1.5 py-0.5 font-label-code text-label-code text-on-surface-variant';

export const errorMessage = (err, fallback) => err.response?.data?.data?.message || fallback;

export function formatMoney(value, currency = 'ARS') {
  if (value == null) return '—';
  return Number(value).toLocaleString('es-AR', { style: 'currency', currency });
}

export function formatQty(value, unit) {
  if (value == null) return '—';
  return `${Number(value).toLocaleString('es-AR')}${unit ? ` ${unit}` : ''}`;
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-AR');
}

// Situación del stock del depósito propio respecto del mínimo.
export function stockStatus(product) {
  const actual = Number(product.stock_actual ?? 0);
  if (actual <= 0) return 'sin_stock';
  if (product.stock_minimo != null && actual <= product.stock_minimo) return 'bajo';
  return 'normal';
}

export const STOCK_STATUS = {
  normal: { label: 'Stock normal', dot: 'bg-secondary', text: 'text-on-surface' },
  bajo: { label: 'Stock bajo', dot: 'bg-on-tertiary-container', text: 'text-on-tertiary-fixed-variant' },
  sin_stock: { label: 'Sin stock', dot: 'bg-error', text: 'text-error' },
};

export function StatusPill({ dot, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-outline-variant bg-surface-container-low px-2 py-0.5 font-body-sm text-body-sm text-on-surface-variant">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

export function SelectIcon() {
  return (
    <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline">
      expand_more
    </span>
  );
}

export function Icon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// Tipos de movimiento del backend, con el signo que exige para la cantidad (0 = cualquiera).
// reserva y liberacion_reserva mueven stock_reservado; el resto mueve stock_actual.
export const MOVEMENT_TYPES = {
  entrada_compra: { label: 'Entrada (compra)', sign: 1 },
  salida_mostrador: { label: 'Salida (mostrador)', sign: -1 },
  salida_obra: { label: 'Salida (obra)', sign: -1 },
  salida_taller: { label: 'Salida (taller)', sign: -1 },
  ajuste: { label: 'Ajuste', sign: 0 },
  merma: { label: 'Merma', sign: -1 },
  reserva: { label: 'Reserva', sign: 1 },
  liberacion_reserva: { label: 'Liberación de reserva', sign: -1 },
};

export const isReservation = (tipo) => tipo === 'reserva' || tipo === 'liberacion_reserva';
