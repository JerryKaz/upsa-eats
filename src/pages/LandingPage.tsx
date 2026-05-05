import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, FastForward, ShieldCheck, Heart, Headphones } from 'lucide-react';
import { mockVendors } from '../data/mockData';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-slate-800 mb-6">
              Delicious food, <br />
              <span className="text-primary-500">delivered fast</span>
            </h1>
            <p className="text-xl text-slate-500 mb-8 max-w-lg leading-relaxed">
              Order from your favorite campus vendors and enjoy meals without the wait. The best campus food experience.
            </p>
            
            <div className="bg-white p-2 rounded-full shadow-2xl flex border border-slate-100 max-w-xl group focus-within:ring-4 ring-primary-100 transition-all">
              <div className="flex-1 px-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="What are you craving today?" 
                  className="w-full py-4 text-slate-700 outline-none"
                />
              </div>
              <Link to="/dashboard" className="bg-primary-500 text-white px-10 py-4 rounded-full font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 active:scale-95">
                Search
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-12">
              {[
                { icon: FastForward, label: 'Fast Delivery' },
                { icon: ShieldCheck, label: 'Secure Payment' },
                { icon: Heart, label: 'Best Vendors' },
                { icon: Headphones, label: '24/7 Support' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                    <item.icon size={16} />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-100 rounded-full blur-[100px] opacity-30 -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop" 
              alt="Food plate"
              className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] rounded-full border-8 border-white p-2 rotate-6 hover:rotate-0 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Popular Vendors */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-800">Popular Vendors</h2>
              <p className="text-slate-500 mt-2">Check out what's trending on campus</p>
            </div>
            <Link to="/vendors" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all group">
              View all <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {mockVendors.slice(0, 4).map((vendor) => (
              <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="group text-center">
                <div className="relative mb-6">
                  <div className="w-full aspect-square overflow-hidden rounded-full ring-4 ring-white shadow-xl transition-all duration-300 group-hover:ring-primary-500 group-hover:-translate-y-2">
                    <img 
                      src={vendor.image} 
                      alt={vendor.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg border border-slate-100 text-sm font-bold flex items-center gap-1">
                    <span className="text-amber-500">★</span> {vendor.rating}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors uppercase tracking-wide text-sm">{vendor.name}</h3>
                <p className="text-slate-500 text-xs mt-1">{vendor.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary-600 py-6 text-center text-white font-medium">
        <p>UPSA Eats — Making campus food ordering easy and enjoyable!</p>
      </footer>
    </div>
  );
}
