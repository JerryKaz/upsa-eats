import React from 'react';
import { Star, Clock, Bike, Utensils, MapPin } from 'lucide-react';
import { Vendor } from '../types';
import { Link } from 'react-router-dom';

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link to={`/vendors/${vendor.id}`} className="block group">
      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2">
        <div className="h-44 bg-slate-200 relative overflow-hidden">
          <img 
            src={vendor.image} 
            alt={vendor.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/50 border-slate-100/50">
            <Star size={14} className="text-secondary-500" fill="currentColor" />
            <span className="text-slate-800 font-display">{vendor.rating}</span>
            {vendor.reviewsCount && (
              <span className="text-[10px] text-slate-400 font-normal">({vendor.reviewsCount})</span>
            )}
          </div>
          
          {/* Status Badge (if it was available, but let's add a decorative tag) */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-primary-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary-500/20 uppercase tracking-widest">
              Popular
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-display font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors leading-snug">
                {vendor.name}
              </h4>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1 text-[11px] font-medium">
                <Utensils size={12} className="text-slate-300" />
                {vendor.category}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <div className="flex items-center gap-1 text-[11px] font-medium">
                <MapPin size={12} className="text-slate-300" />
                {vendor.location}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Delivery</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                  <Clock size={14} className="text-primary-500" />
                  {vendor.deliveryTime}
                </div>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Fee</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                  <Bike size={14} className={vendor.isFreeDelivery ? "text-secondary-500" : "text-slate-400"} />
                  {vendor.isFreeDelivery ? 'FREE' : 'GHS 5.00'}
                </div>
              </div>
            </div>
            
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-90 transition-all duration-500 rounded-2xl flex items-center justify-center text-slate-400">
              <Star size={18} fill="currentColor" className="opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
