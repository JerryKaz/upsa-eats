import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Star, Clock } from 'lucide-react';
import { mockVendors } from '../data/mockData';
import VendorCard from '../components/VendorCard';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const categories = Array.from(new Set(mockVendors.map(v => v.category)));

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800">Vendors</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Campus Vendors</h1>
          <p className="text-slate-500 mt-1">Discover the best meals across UPSA</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search for vendor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-3 rounded-2xl transition-all border",
              showFilters 
                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20" 
                : "bg-white border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-200 shadow-sm"
            )}
          >
            <SlidersHorizontal size={22} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Filter Options</h3>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setMinRating(0);
              }}
              className="text-xs font-bold text-primary-500 uppercase tracking-widest hover:text-primary-600"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Category Filter */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                      selectedCategory === cat
                        ? "bg-primary-500 text-white border-primary-500 shadow-md"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:border-slate-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700">Minimum Rating</h4>
              <div className="flex gap-2">
                {[3, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1",
                      minRating === rating
                        ? "bg-amber-500 text-white border-amber-500 shadow-md"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:border-slate-200"
                    )}
                  >
                    <Star size={14} fill={minRating === rating ? "white" : "currentColor"} className={minRating === rating ? "text-white" : "text-amber-500"} />
                    {rating}+
                  </button>
                ))}
              </div>
            </div>

            {/* delivery filter info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Average Rating</span>
                  <span className="text-lg font-bold text-slate-800">4.5 ★</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Vendors</span>
                  <span className="text-lg font-bold text-slate-800">{mockVendors.length}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredVendors.map((vendor) => (
            <motion.div 
              layout
              key={vendor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <VendorCard vendor={vendor} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[32px] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
            <Search size={40} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-800">No vendors found</h2>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            We couldn't find any vendors matching your current search or filter criteria.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setMinRating(0);
            }}
            className="mt-8 bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
