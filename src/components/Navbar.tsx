import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Bell, User as UserIcon } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { mockUser } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/vendors') || 
                      location.pathname.startsWith('/orders') || 
                      location.pathname.startsWith('/profile');

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isDashboard ? 'bg-white/80' : 'bg-transparent'} backdrop-blur-md px-6 py-4`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {!isDashboard && (
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-primary-600">UPSA Eats</span>
          </Link>
        )}

        <div className="flex-1 max-w-xl hidden md:flex relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search for food or vendor..." 
            className="w-full bg-slate-100 border-none rounded-full py-3 pl-12 pr-6 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-6">
          <nav className={`hidden lg:flex items-center gap-8 font-medium ${isDashboard ? 'text-slate-600' : 'text-slate-500'}`}>
            {!isDashboard && (
              <>
                <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                <Link to="/vendors" className="hover:text-primary-600 transition-colors">Vendors</Link>
                <Link to="/orders" className="hover:text-primary-600 transition-colors">Track Order</Link>
                <Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" id="cart-icon" className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors group">
              <ShoppingCart size={22} className="text-slate-700" />
              <AnimatePresence mode="popLayout">
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
              <Bell size={22} className="text-slate-700" />
            </button>

            <Link to="/profile" className="flex items-center gap-3 p-1.5 pr-4 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
              <img 
                src={mockUser.image} 
                alt={mockUser.name}
                className="w-8 h-8 rounded-full object-crop"
              />
              <span className="hidden sm:block text-sm font-semibold text-slate-700">
                {mockUser.name}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
