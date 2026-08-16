import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GaneshIcon } from '../devotional/GaneshIcon';
import {
  Home,
  HeartHandshake,
  Receipt,
  CreditCard,
  PieChart,
  FileText,
  Image as ImageIcon,
  UserCheck,
  Palette,
  Settings,
  ShieldCheck,
  User,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const adminNavItems = [
    { id: 'dashboard', label: 'Mandapam', icon: Home },
    { id: 'offerings', label: 'Offerings', icon: HeartHandshake },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'payments', label: 'Vendor Payments', icon: CreditCard },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'committee', label: 'Committee Members', icon: UserCheck },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'settings', label: 'Event Settings', icon: Settings },
    { id: 'audit-logs', label: 'Audit Logs', icon: ShieldCheck },
  ];

  const committeeNavItems = [
    { id: 'dashboard', label: 'Mandapam', icon: Home },
    { id: 'offerings', label: 'Offerings', icon: HeartHandshake },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'payments', label: 'Vendor Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : committeeNavItems;

  const handleSelect = (id: string) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-maroon-950 border-r border-gold-500/30 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-mandapam ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-maroon-900 rounded-xl border border-gold-500/50 shadow-gold-glow">
              <GaneshIcon className="w-8 h-8 text-gold-400" />
            </div>
            <div>
              <h1 className="font-cinzel font-bold text-sm text-slate-900 dark:text-gold-300">
                Bala Ganapathi
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-amber-200/70 font-telugu-devotional font-semibold">
                సేవా సమితి 2026
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:text-amber-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Roster */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition ${
                  isActive
                    ? 'bg-saffron-500 text-white shadow-saffron-glow font-bold'
                    : 'text-slate-700 dark:text-amber-200/80 hover:bg-slate-100 dark:hover:bg-maroon-900/60 hover:text-slate-900 dark:hover:text-gold-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-saffron-500 dark:text-gold-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-gold-500/20 bg-slate-50 dark:bg-maroon-900/40">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-saffron-500/20 border border-saffron-400/40 text-saffron-400 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <span className="block font-bold text-slate-900 dark:text-amber-100 truncate">
                {user?.name}
              </span>
              <span className="block text-[10px] font-mono text-gold-500 dark:text-gold-400">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
