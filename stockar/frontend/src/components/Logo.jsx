// Logo de StockAR: tres cajas apiladas (el stock) sobre un cuadrado azul marino,
// con la caja de arriba en el azul de acción. Todo en SVG inline, sin imágenes externas.
export function LogoMark({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="StockAR">
      <rect width="32" height="32" rx="7" fill="#131b2e" />
      <rect x="7" y="18" width="8" height="7" rx="1.5" fill="#ffffff" />
      <rect x="17" y="18" width="8" height="7" rx="1.5" fill="#bec6e0" />
      <rect x="12" y="9" width="8" height="7" rx="1.5" fill="#316bf3" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-headline-md text-headline-md font-semibold tracking-tight text-on-surface">
          Stock<span className="text-secondary">AR</span>
        </span>
        <span className="font-label-caps text-[10px] uppercase tracking-[0.08em] text-outline">Gestión de inventario</span>
      </span>
    </span>
  );
}
