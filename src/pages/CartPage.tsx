import React, { useState } from 'react';
import { useCartStore, useOrderStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, MapPin, PlusCircle, CheckCircle2, Clock, Home, School } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const SAVED_ADDRESSES = [
  { id: '1', label: 'Hostel', address: 'Pentagon Block B, Room 304', icon: <Home size={20} /> },
  { id: '2', label: 'Lecture Hall', address: 'Nelson Mandela Hall, Room 12', icon: <School size={20} /> },
];

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState(SAVED_ADDRESSES[0].id);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliveryPreference, setDeliveryPreference] = useState('ASAP');
  const [specificTime, setSpecificTime] = useState('12:00');

  const subtotal = getTotal();
  const deliveryFee = subtotal > 0 ? 5.0 : 0.0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) return;

    const now = new Date();
    const estTime = new Date(now.getTime() + 45 * 60000); // 45 mins later

    const newOrder = {
      id: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      vendorName: items[0]?.vendorName || 'Campus Vendor',
      vendorId: items[0]?.vendorId,
      status: 'Preparing' as const,
      total,
      items: [...items],
      estimatedDeliveryTime: estTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      deliveryPreference: deliveryPreference === 'Specific Time' ? `Scheduled for ${specificTime}` : deliveryPreference,
      address: `${selectedAddress.label}: ${selectedAddress.address}`,
      deliveryInstructions: deliveryInstructions.trim() || undefined
    };
    
    addOrder(newOrder);
    clearCart();
    navigate(`/orders/${newOrder.id}`);
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address) return;
    const added = {
      id: Math.random().toString(36).substr(2, 9),
      label: newAddress.label,
      address: newAddress.address,
      icon: <MapPin size={20} />
    };
    setAddresses([...addresses, added]);
    setSelectedAddressId(added.id);
    setIsAddingAddress(false);
    setNewAddress({ label: '', address: '' });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-8">
          <Trash2 size={48} />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Go ahead and explore top vendors!
        </p>
        <Link to="/vendors" className="bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-600 transition-all flex items-center gap-2">
          Explore Vendors <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-800">Cart / Checkout</h1>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800">Cart</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items & Address */}
        <div className="lg:col-span-2 space-y-8">
          {/* Address Selection */}
          <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="text-primary-500" size={20} />
                Delivery Address
              </h3>
              <button 
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-bold text-primary-500 flex items-center gap-1 hover:text-primary-600 uppercase tracking-widest"
              >
                <PlusCircle size={14} />
                Add New
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                    selectedAddressId === addr.id 
                      ? "bg-primary-50 border-primary-200 shadow-sm shadow-primary-500/5" 
                      : "bg-white border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                      selectedAddressId === addr.id ? "bg-white text-primary-500" : "bg-slate-50 text-slate-400"
                    )}>
                      {addr.icon}
                    </div>
                    <div>
                      <p className={cn(
                        "font-bold text-sm",
                        selectedAddressId === addr.id ? "text-primary-900" : "text-slate-700"
                      )}>{addr.label}</p>
                      <p className="text-xs text-slate-500">{addr.address}</p>
                    </div>
                  </div>
                  {selectedAddressId === addr.id && (
                    <CheckCircle2 className="text-primary-500" size={20} />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {isAddingAddress && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase px-1">Label</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Work, Gym"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase px-1">Address</label>
                        <input 
                          type="text" 
                          placeholder="Hostel name, room no..."
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={handleAddAddress}
                        className="bg-primary-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/10 hover:bg-primary-600 transition-all"
                      >
                        Save Address
                      </button>
                      <button 
                        onClick={() => setIsAddingAddress(false)}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Delivery Instructions */}
          <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <PlusCircle className="text-primary-500" size={20} />
              Delivery Instructions
            </h3>
            <textarea
              placeholder="e.g. Leave at the door, call upon arrival, etc."
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-sm min-h-[100px] transition-all resize-none"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {['Leave at door', 'Call upon arrival', 'Meet at lobby'].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setDeliveryInstructions(hint)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-500 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          </section>

          {/* Delivery Time Slot */}
          <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Clock className="text-primary-500" size={20} />
              Delivery Time
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'ASAP', label: 'ASAP', desc: 'Deliver as soon as possible' },
                { id: 'Within 1 hour', label: 'Within 1 hour', desc: 'Arrives in 45-60 mins' },
                { id: 'Specific Time', label: 'Specific Time', desc: 'Schedule for later' },
              ].map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setDeliveryPreference(slot.id)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all",
                    deliveryPreference === slot.id 
                      ? "bg-primary-50 border-primary-200 ring-1 ring-primary-200" 
                      : "bg-white border-slate-100 hover:border-slate-200"
                  )}
                >
                  <p className={cn(
                    "font-bold text-sm mb-1",
                    deliveryPreference === slot.id ? "text-primary-900" : "text-slate-800"
                  )}>
                    {slot.label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{slot.desc}</p>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {deliveryPreference === 'Specific Time' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase px-1">Select Time</label>
                      <input 
                        type="time" 
                        value={specificTime}
                        onChange={(e) => setSpecificTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-sm font-bold"
                      />
                    </div>
                    <div className="bg-primary-50 p-4 rounded-2xl flex-1 border border-primary-100">
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">Note</p>
                      <p className="text-xs text-primary-800 leading-relaxed font-medium">
                        Scheduling depends on vendor availability.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 text-lg px-2">Order Summary</h3>
            {items.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="bg-white rounded-3xl p-4 flex gap-6 border border-slate-100 group"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-slate-600 shadow-sm hover:bg-primary-500 hover:text-white transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-slate-800 px-2">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-slate-600 shadow-sm hover:bg-primary-500 hover:text-white transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-slate-800">
                    GHS {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-800 block">Promo Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter promo code" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-sm"
                  />
                </div>
                <button className="bg-secondary-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-secondary-700 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>GHS {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Delivery Fee</span>
                <span>GHS {deliveryFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
              <div>
                <span className="text-xl font-bold text-slate-900 block">Total</span>
              </div>
              <span className="text-2xl font-bold text-primary-500">
                GHS {total.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-primary-500 text-white py-4 rounded-2xl font-bold text-center mt-4 shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-colors active:scale-95 transition-transform"
            >
              Checkout
            </button>
          </div>

          <div className="bg-primary-50 rounded-2xl p-4 flex items-center gap-3 border border-primary-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-500">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs text-primary-800 font-medium leading-relaxed">
              Fast & Reliable Delivery within UPSA Campus for all orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
