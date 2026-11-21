import { Link, NavLink, Outlet } from 'react-router-dom';
import Logo from './Logo.jsx';

const TABS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/productos', label: 'Productos', icon: 'inventory_2' },
  { to: '/movimientos', label: 'Movimientos', icon: 'swap_horiz' },
  { to: '/proveedores', label: 'Proveedores', icon: 'request_quote' },
  { to: '/listas-precios', label: 'Listas de precios', icon: 'price_change' },
];

const tabBase = 'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 font-body-md text-body-md font-medium transition-colors';
const tabActive = 'bg-primary-container text-on-primary';
const tabIdle = 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface-container-lowest/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-space-sm px-margin-mobile py-space-sm md:h-16 md:flex-row md:items-center md:gap-space-xl md:px-margin md:py-0">
          <Link to="/dashboard" className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
            <Logo />
          </Link>

          <nav className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1 md:pb-0">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) => `${tabBase} ${isActive ? tabActive : tabIdle}`}
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-inverse-primary' : 'text-outline'}`}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-margin-mobile py-space-xl md:px-margin">
        <Outlet />
      </main>

      <footer className="border-t border-outline-variant">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-space-sm px-margin-mobile py-space-md font-body-sm text-body-sm text-outline md:px-margin">
          <span>StockAR · Gestión de inventario y proveedores</span>
          <span className="font-label-code text-label-code">v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}
