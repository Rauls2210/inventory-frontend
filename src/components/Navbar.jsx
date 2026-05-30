import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-gray-800">Inventory Management</h1>
      </div>

      <div className="relative">
        <button
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{user?.name}</span>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                onClick={logout}
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
