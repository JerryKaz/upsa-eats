import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, Clock, Info, CheckCircle, Search } from 'lucide-react';
import { mockVendors, mockFoodItems } from '../data/mockData';
import FoodCard from '../components/FoodCard';
import { cn } from '../lib/utils';

export default function MenuPage() {
  const { id } = useParams();
  const vendor = mockVendors.find((v) => v.id === id) || mockVendors[0];
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Main Meals', 'Rice Dishes', 'Snacks', 'Drinks'];
  
  const filteredFood = activeTab === 'All' 
    ? mockFoodItems 
    : mockFoodItems.filter(item => item.category === activeTab);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
        <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/vendors" className="hover:text-primary-500 transition-colors">Vendors</Link>
        <span>/</span>
        <span className="text-slate-800">{vendor.name}</span>
      </div>

      {/* Vendor Header */}
      <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Info size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden ring-4 ring-primary-50 shadow-lg">
            <img 
              src={vendor.image} 
              alt={vendor.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                {vendor.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm">
                <Star size={16} fill="currentColor" />
                {vendor.rating} <span className="text-slate-400 font-normal ml-1">(120+)</span>
              </div>
            </div>
            <p className="text-slate-500 mb-6 flex items-center justify-center md:justify-start gap-2">
              {vendor.location} 
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock size={18} className="text-primary-500" />
                {vendor.deliveryTime}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CheckCircle size={18} className="text-secondary-500" />
                Free Delivery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Navigation */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all border-2",
              activeTab === tab
                ? "bg-secondary-600 border-secondary-600 text-white shadow-lg shadow-secondary-500/20"
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {filteredFood.map((food, idx) => (
          <div key={food.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
            <FoodCard food={food} />
          </div>
        ))}
      </div>
    </div>
  );
}
