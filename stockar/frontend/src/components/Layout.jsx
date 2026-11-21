import { NavLink, Outlet } from 'react-router-dom';

const TABS = [
  { to: '/productos', label: 'Productos', icon: 'inventory_2' },
  { to: '/proveedores', label: 'Proveedores', icon: 'request_quote' },
];

const tabBase = 'flex items-center gap-2.5 rounded px-3 py-2 font-body-md text-body-md font-medium transition-colors';
const tabActive = 'bg-primary text-on-primary';
const tabIdle = 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-space-lg px-margin-mobile md:px-margin">
          <span className="font-headline-md text-headline-md font-semibold text-on-surface">StockAR</span>

          <nav className="flex items-center gap-space-xs">
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

      <main className="mx-auto max-w-6xl px-margin-mobile py-space-lg md:px-margin">
        <Outlet />
      </main>
    </div>
  );
}
