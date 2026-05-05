import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, ClipboardList, Heart, User } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Store, label: 'Vendors', path: '/vendors' },
  { icon: ClipboardList, label: 'Orders', path: '/orders' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-3xl flex items-center justify-around px-4 shadow-2xl z-50 transition-all duration-300">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-200",
              isActive ? "text-primary-500 scale-110" : "text-slate-400"
            )
          }
        >
          <item.icon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
