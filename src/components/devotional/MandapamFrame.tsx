import React from 'react';
import { GaneshIcon } from './GaneshIcon';
import { useAuth } from '../../context/AuthContext';

export type NavTab =
  | 'mandapam'
  | 'offerings'
  | 'expenses'
  | 'payments'
  | 'budget'
  | 'reports'
  | 'gallery'
  | 'committee'
  | 'appearance'
  | 'settings'
  | 'audit-logs'
  | 'profile';

interface MandapamFrameProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  children: React.ReactNode;
}

export const MandapamFrame: React.FC<MandapamFrameProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const adminNavItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'mandapam', label: 'Mandapam', icon: '🏠' },
    { id: 'offerings', label: 'Offerings', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '🪔' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'budget', label: 'Budget', icon: '🎯' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'gallery', label: 'Gallery', icon: '🖼' },
    { id: 'committee', label: 'Committee', icon: '👨‍👩‍👧' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
    { id: 'audit-logs', label: 'Audit Logs', icon: '🔐' },
  ];

  const committeeNavItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'mandapam', label: 'Mandapam', icon: '🏠' },
    { id: 'offerings', label: 'Offerings', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '🪔' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'gallery', label: 'Gallery', icon: '🖼' },
  ];

  const navItems = isAdmin ? adminNavItems : committeeNavItems;

  // Deduplicated mobile navigation tabs (Max 6 distinct items)
  const mobileNavItems: { id: NavTab; label: string; icon: string }[] = isAdmin
    ? [
        { id: 'mandapam', label: 'Mandapam', icon: '🏠' },
        { id: 'offerings', label: 'Offerings', icon: '💰' },
        { id: 'expenses', label: 'Expenses', icon: '🪔' },
        { id: 'payments', label: 'Payments', icon: '💳' },
        { id: 'reports', label: 'Reports', icon: '📊' },
        { id: 'gallery', label: 'Gallery', icon: '🖼' },
      ]
    : committeeNavItems;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800 dark:text-amber-50">
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 gap-6">
        {/* Desktop Devotional Navigation Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-maroon-950/80 backdrop-blur-md border border-gold-500/40 rounded-2xl shadow-mandapam p-4 text-amber-100 h-[calc(100vh-6rem)] sticky top-6">
          <div className="flex items-center gap-3 pb-4 mb-3 border-b border-gold-500/30">
            <div className="p-1.5 bg-maroon-950 rounded-lg border border-gold-500/40">
              <GaneshIcon className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-sm text-gold-300">Bala Ganapathi</h2>
              <p className="text-[10px] text-amber-200/70">Seva Samithi 2026</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-saffron-500 text-white font-bold shadow-saffron-glow translate-x-1'
                      : 'hover:bg-maroon-700/60 text-amber-200/90'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="font-medium text-left">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {user && (
            <div className="pt-3 border-t border-gold-500/30 text-xs">
              <p className="font-semibold text-amber-200 truncate">{user.name}</p>
              <span className="inline-block px-1.5 py-0.5 text-[9px] rounded bg-gold-500/20 text-gold-300 font-mono mt-0.5">
                {user.role}
              </span>
            </div>
          )}
        </aside>

        {/* Main Body */}
        <main className="flex-1 w-full min-w-0 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile Devotional Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-maroon-950/95 backdrop-blur-md border-t border-gold-500/40 text-amber-200 px-2 py-1 shadow-mandapam">
        <div className="flex items-center justify-around overflow-x-auto py-1 space-x-1">
          {mobileNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center px-2 py-1 rounded-lg text-[10px] min-w-[50px] transition ${
                  isActive
                    ? 'text-gold-400 font-bold bg-maroon-800/80 border border-gold-500/30'
                    : 'text-amber-200/70'
                }`}
              >
                <span className="text-base leading-none mb-0.5">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
          {user && (
            <button
              onClick={logout}
              className="flex flex-col items-center px-2 py-1 rounded-lg text-[10px] min-w-[50px] text-red-400 font-bold hover:bg-red-500/20 transition"
              title="Logout"
            >
              <span className="text-base leading-none mb-0.5">🚪</span>
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
