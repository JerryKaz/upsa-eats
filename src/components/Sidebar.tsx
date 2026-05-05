import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Store, 
  ClipboardList, 
  Heart, 
  User, 
  LogOut, 
  UtensilsCrossed 
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Store, label: 'Vendors', path: '/vendors' },
  { icon: ClipboardList, label: 'Orders', path: '/orders' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          U
        </div>
        <span className="hidden md:block font-display font-bold text-xl tracking-tight">
          UPSA <span className="text-primary-500">Eats</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 font-semibold group",
                isActive 
                  ? "bg-primary-50 text-primary-600" 
                  : "text-slate-500 hover:bg-slate-50"
              )
            }
          >
            <item.icon size={22} className={cn("transition-transform duration-200 group-hover:scale-110")} />
            <span className="hidden md:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="hidden md:block mb-4 p-4 bg-slate-900 rounded-2xl text-white">
          <p className="text-xs text-slate-400 mb-1 font-medium">Available Balance</p>
          <p className="text-lg font-bold">GH₵ 142.50</p>
          <button className="w-full mt-3 bg-white text-slate-900 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">
            Top Up
          </button>
        </div>
        <button className="flex items-center gap-4 p-4 w-full rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group">
          <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
