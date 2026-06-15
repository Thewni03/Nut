import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { to: '/', label: 'Dashboard' },
  { to: '/orders', label: 'Orders' },
  { to: '/hampers', label: 'Hampers' },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
];

export default function TopNav() {
  const { fullName, logout } = useAuth();

  return (
    <header className="bg-almond-light border-b border-walnut/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-walnut text-almond-light font-display text-base">
              N
            </span>
            <span className="font-display text-lg text-walnut tracking-tight">Nutique Co Admin</span>
          </div>

          <div className="flex items-center gap-4">
            {fullName && <span className="hidden sm:inline text-sm text-walnut/60">{fullName}</span>}
            <button
              type="button"
              onClick={logout}
              className="text-sm font-medium text-walnut/70 hover:text-sage-dark transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-thin">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-sage text-walnut'
                    : 'border-transparent text-walnut/55 hover:text-walnut hover:border-walnut/15'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
