import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, Clock, Bike, X, ChevronRight, Package, ArrowRight, Hamburger, Pizza, Salad, CupSoda, Soup, UtensilsCrossed, Store } from 'lucide-react';
import { mockVendors, mockUser } from '../data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import VendorCard from '../components/VendorCard';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useOrderStore } from '../store/useCartStore';

export default function Dashboard() {
  const { orders } = useOrderStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const recentOrders = useMemo(() => orders.slice(-3).reverse(), [orders]);

  // Extract frequently ordered items and vendors
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const pastItems = orders.flatMap(o => o.items);
    const pastVendors = orders.map(o => o.vendorName);

    const uniqueItems = Array.from(new Set(pastItems.map(i => i.name)))
      .filter((name): name is string => typeof name === 'string' && name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 3)
      .map(name => ({ type: 'Food', name }));

    const uniqueVendors = Array.from(new Set(pastVendors))
      .filter((name): name is string => typeof name === 'string' && name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 2)
      .map(name => ({ type: 'Vendor', name }));

    return [...uniqueVendors, ...uniqueItems];
  }, [searchQuery, orders]);

  const categories = [
    { name: 'Local Rice', icon: <Soup size={24} />, bg: 'bg-orange-100', slug: 'Local Dishes' },
    { name: 'Burgers', icon: <Hamburger size={24} />, bg: 'bg-yellow-100', slug: 'Burgers' },
    { name: 'Drinks', icon: <CupSoda size={24} />, bg: 'bg-blue-100', slug: 'Drinks' },
    { name: 'Pizza', icon: <Pizza size={24} />, bg: 'bg-primary-600', color: 'text-white', slug: 'Pizza & More' },
    { name: 'Salads', icon: <Salad size={24} />, bg: 'bg-green-100', slug: 'Healthy' },
  ];

  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || vendor.category === selectedCategory;
      const matchesRating = vendor.rating >= minRating;
      
      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [searchQuery, selectedCategory, minRating]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Hello, {mockUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500">What are we eating today?</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search food, vendors..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 border-none transition-all"
            />
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20">
                <div className="p-2">
                  <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions from past orders</p>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSearchQuery(s.name);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-xs",
                          s.type === 'Food' ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"
                        )}>
                          {s.type === 'Food' ? <UtensilsCrossed size={16} /> : <Store size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.type}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 rounded-full transition-colors",
              showFilters ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">Advanced Filters</h4>
            <button 
              onClick={() => {
                setMinRating(0);
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 uppercase tracking-wider"
            >
              Reset All
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Minimum Rating</label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      minRating === rating 
                        ? "bg-primary-500 text-white" 
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {rating === 0 ? 'All' : `${rating}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    !selectedCategory ? "bg-primary-500 text-white" : "bg-slate-50 text-slate-500"
                  )}
                >
                  All Categories
                </button>
                {selectedCategory && (
                   <button 
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-50 text-primary-600 flex items-center gap-1"
                  >
                    {selectedCategory} <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Banner */}
      <div className="relative h-44 gradient-hero rounded-[2rem] p-8 text-white flex justify-between items-center overflow-hidden shadow-vibrant">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Promo of the week</span>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">Get 25% Off at<br />Chicken Man 🐔</h2>
          <Link to="/vendors" className="px-6 py-2 bg-white text-primary-600 font-bold rounded-xl text-sm hover:shadow-lg transition-all active:scale-95">
            Order Now
          </Link>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-20 transform -rotate-12">
          <div className="w-64 h-64 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Recent Orders History */}
      {recentOrders.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-primary-500" size={20} />
              Recent Orders
            </h3>
            <Link to="/orders" className="text-xs font-bold text-primary-500 flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest leading-none bg-primary-50 px-4 py-2 rounded-full">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentOrders.map((order, idx) => (
              <motion.button
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between text-left hover:border-primary-200 transition-all hover:shadow-xl hover:shadow-primary-500/5 group active:scale-[0.98] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
                    <ArrowRight size={14} />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                      <Package size={24} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border",
                      order.status === 'Pending' && "bg-slate-50 text-slate-500 border-slate-100",
                      order.status === 'Confirmed' && "bg-sky-50 text-sky-600 border-sky-100",
                      order.status === 'Preparing' && "bg-amber-50 text-amber-600 border-amber-100",
                      order.status === 'Out for Delivery' && "bg-indigo-50 text-indigo-600 border-indigo-100",
                      order.status === 'Delivered' && "bg-secondary-50 text-secondary-600 border-secondary-100",
                      order.status === 'Cancelled' && "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-primary-600 transition-colors">{order.vendorName}</h4>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Clock size={12} className="opacity-60" />
                    {order.date} • {order.time}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Total</span>
                    <span className="text-sm font-bold text-slate-900 font-display">GHS {order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Items</span>
                    <span className="text-xs font-bold text-slate-500">{order.items.length} dishes</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Categories</h3>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-primary-500 text-sm font-bold"
          >
            Clear Filters
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
              className={cn(
                "flex-shrink-0 w-24 md:w-32 p-4 rounded-3xl flex flex-col items-center gap-3 border shadow-sm transition-all cursor-pointer group",
                selectedCategory === cat.slug 
                  ? "bg-primary-500 border-primary-500 shadow-xl shadow-primary-500/30 -translate-y-1" 
                  : "bg-white border-slate-100 hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", 
                selectedCategory === cat.slug ? "bg-white/20 text-white" : cat.bg
              )}>
                {cat.icon}
              </div>
              <span className={cn(
                "text-[11px] md:text-sm font-bold tracking-tight text-center leading-tight transition-colors", 
                selectedCategory === cat.slug ? "text-white" : (cat.color || "text-slate-700")
              )}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">
            {selectedCategory || searchQuery ? 'Filter Results' : 'Popular Near You'}
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
            {filteredVendors.length} Found
          </span>
        </div>
        
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id}>
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Search size={32} />
            </div>
            <h4 className="font-bold text-slate-800">No vendors found</h4>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setMinRating(0);
              }}
              className="mt-6 text-primary-500 font-bold text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
