import { useCallback, useEffect, useRef, useState } from 'react';

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
export const pageTitle =
  'font-headline-xl-mobile text-headline-xl-mobile text-on-surface md:font-headline-xl md:text-headline-xl';
export const sectionTitle = 'font-headline-md text-headline-md text-on-surface';
export const th = 'whitespace-nowrap px-4 py-3 font-label-caps text-label-caps uppercase text-on-surface-variant';
export const td = 'px-4 py-3 font-body-md text-body-md text-on-surface-variant';
// Celda numérica sin color: para las que lo eligen según el dato (stock, variación, etc.).
export const tdNumBase = 'px-4 py-3 text-right font-label-tabular text-label-tabular tabular-nums';
export const tdNum = `${tdNumBase} text-on-surface`;
export const primaryButton =
  'inline-flex items-center gap-1.5 rounded bg-primary-container px-4 py-2 font-body-md text-body-md font-medium text-on-primary hover:bg-on-primary-fixed-variant disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary';
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
  normal: { label: 'Stock normal', tone: 'success', text: 'text-on-surface' },
  bajo: { label: 'Stock bajo', tone: 'warning', text: 'text-on-warning-container' },
  sin_stock: { label: 'Sin stock', tone: 'danger', text: 'text-on-danger-container' },
};

// Tonos de estado: punto de color + fondo y texto suaves (DESIGN.md, "Status Indicators").
export const TONES = {
  success: { dot: 'bg-success', pill: 'border-success/30 bg-success-container text-on-success-container', icon: 'bg-success-container text-on-success-container' },
  warning: { dot: 'bg-warning', pill: 'border-warning/30 bg-warning-container text-on-warning-container', icon: 'bg-warning-container text-on-warning-container' },
  danger: { dot: 'bg-danger', pill: 'border-danger/30 bg-danger-container text-on-danger-container', icon: 'bg-danger-container text-on-danger-container' },
  info: { dot: 'bg-info', pill: 'border-info/30 bg-info-container text-on-info-container', icon: 'bg-info-container text-on-info-container' },
  idle: { dot: 'bg-idle', pill: 'border-outline-variant bg-idle-container text-on-idle-container', icon: 'bg-idle-container text-on-idle-container' },
};

// Estado de catálogo (producto o proveedor): activo / inactivo.
export const activeTone = (estado) => (estado === 'activo' || estado === true ? 'success' : 'idle');

export function StatusPill({ tone = 'idle', children }) {
  const t = TONES[tone] ?? TONES.idle;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 font-body-sm text-body-sm font-medium ${t.pill}`}>
      <span className={`size-1.5 rounded-full ${t.dot}`} />
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

// Encabezado de cada pantalla: título, descripción y acciones a la derecha.
export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-space-lg flex flex-col gap-space-md border-b border-outline-variant pb-space-lg md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-space-xs">
        <h2 className={pageTitle}>{title}</h2>
        {description && <p className={`max-w-2xl ${mutedText}`}>{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-space-sm">{actions}</div>}
    </div>
  );
}

// Panel con barra de título para formularios que se abren y se cierran.
export function Panel({ title, icon, onClose, children }) {
  return (
    <section className="mb-space-xl overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
      <div className="flex items-center justify-between gap-space-sm border-b border-outline-variant bg-surface-container-lowest px-space-lg py-space-md">
        <h3 className={`flex items-center gap-space-sm ${sectionTitle}`}>
          {icon && <span className="material-symbols-outlined rounded bg-primary-fixed p-1 text-[20px] text-on-primary-fixed">{icon}</span>}
          {title}
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded p-1 text-outline hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-secondary"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>
      <div className="p-space-lg">{children}</div>
    </section>
  );
}

// Título de sección dentro de una pantalla, con texto de ayuda y acciones opcionales.
export function SectionHeader({ title, description, actions }) {
  return (
    <div className="mb-space-md flex flex-wrap items-end justify-between gap-space-sm">
      <div>
        <h3 className={sectionTitle}>{title}</h3>
        {description && <p className={`mt-space-xs ${mutedText}`}>{description}</p>}
      </div>
      {actions}
    </div>
  );
}

// Mensaje de éxito que se borra solo a los `ms` milisegundos.
// Devuelve [mensaje, mostrar(texto)].
export function useFlash(ms = 3000) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = useCallback(
    (text) => {
      clearTimeout(timer.current);
      setMessage(text);
      timer.current = setTimeout(() => setMessage(null), ms);
    },
    [ms]
  );
  return [message, show];
}

// Aviso de éxito con el estilo de badge del diseño (tono success).
export function SuccessBadge({ message, className = '' }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      {message && (
        <span className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-body-md text-body-md font-medium ${TONES.success.pill}`}>
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {message}
        </span>
      )}
    </div>
  );
}

// Estados de una lista: cargando, error (con reintento) y vacía. Son distintos a propósito:
// "vacía" significa que la API respondió bien y no hay registros.
export function LoadingState({ message }) {
  return (
    <div role="status" className="flex items-center gap-space-sm rounded-md border border-outline-variant bg-surface-container-low px-space-lg py-space-xl font-sans">
      <span className="material-symbols-outlined animate-spin text-[20px] text-outline">progress_activity</span>
      <span className="font-body-md text-body-md text-on-surface-variant">{message}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-space-md rounded-md border border-error/20 bg-error-container px-space-lg py-space-lg font-sans sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-center gap-space-sm font-body-md text-body-md font-medium text-on-error-container">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest/70">
          <span className="material-symbols-outlined text-[20px] text-error">error</span>
        </span>
        {message}
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-md bg-on-error-container px-4 py-2 font-body-md text-body-md font-medium text-on-error shadow-[0_1px_2px_0_rgba(147,0,10,0.25)] transition-all hover:bg-error hover:shadow-[0_4px_12px_-2px_rgba(186,26,26,0.35)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
        >
          <span className="material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:-rotate-180">refresh</span>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, icon = 'inventory_2' }) {
  return (
    <div className="flex flex-col items-center gap-space-sm rounded-md border border-dashed border-outline-variant bg-surface-container-low px-space-lg py-space-xl text-center font-sans">
      <span className="material-symbols-outlined rounded-full bg-surface-container-lowest p-space-sm text-[28px] text-outline">{icon}</span>
      <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
    </div>
  );
}
