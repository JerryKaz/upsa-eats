import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../store/useCartStore';
import { 
  CheckCircle2, 
  Circle, 
  Package, 
  Clock, 
  MapPin, 
  ExternalLink, 
  ChevronLeft,
  Star,
  Send,
  MessageSquare,
  AlertTriangle,
  XCircle,
  Utensils,
  Bike
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

import LiveTrackingMap from '../components/LiveTrackingMap';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { orders, markOrderAsReviewed, cancelOrder } = useOrderStore();
  const order = orders.find((o) => o.id === id);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!order) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-display font-bold text-slate-800">Order not found</h2>
        <Link to="/orders" className="text-primary-500 font-bold mt-4 block">View your orders</Link>
      </div>
    );
  }

  const orderStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = orderStatuses.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  const statusSteps = [
    { label: 'Placed', icon: <Package size={18} />, statusKey: 'Pending' },
    { label: 'Confirmed', icon: <CheckCircle2 size={18} />, statusKey: 'Confirmed' },
    { label: 'Preparing', icon: <Utensils size={18} />, statusKey: 'Preparing' },
    { label: 'On the Way', icon: <Bike size={18} />, statusKey: 'Out for Delivery' },
    { label: 'Arrived', icon: <CheckCircle2 size={18} />, statusKey: 'Delivered' },
  ];

  const timelineSteps = [
    { label: 'Order Placed', time: order.time, status: 'completed' },
    { 
      label: 'Order Confirmed', 
      time: currentStepIndex >= 1 ? 'Just now' : 'Pending', 
      status: currentStepIndex >= 1 ? 'completed' : currentStepIndex === 0 ? 'current' : 'upcoming' 
    },
    { 
      label: 'Preparing your meal', 
      time: currentStepIndex >= 2 ? 'In progress' : 'Pending', 
      status: currentStepIndex >= 2 ? 'completed' : currentStepIndex === 1 ? 'current' : 'upcoming' 
    },
    { 
      label: 'Out for Delivery', 
      time: currentStepIndex >= 3 ? 'On the way' : 'Pending', 
      status: currentStepIndex >= 3 ? 'completed' : currentStepIndex === 2 ? 'current' : 'upcoming' 
    },
    { 
      label: 'Delivered', 
      time: currentStepIndex >= 4 ? 'Enjoy!' : order.estimatedDeliveryTime || 'Pending', 
      status: currentStepIndex >= 4 ? 'completed' : currentStepIndex === 3 ? 'current' : 'upcoming' 
    },
  ];

  if (isCancelled) {
    timelineSteps.push({ label: 'Order Cancelled', time: 'N/A', status: 'cancelled' as any });
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    markOrderAsReviewed(order.id);
    setIsSubmitting(false);
    toast.success('Thank you for your review!');
  };

  const handleCancelOrder = () => {
    if (order) {
      cancelOrder(order.id);
      setShowCancelConfirm(false);
      toast.success('Order cancelled successfully');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
        <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/orders" className="hover:text-primary-500 transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-slate-800">Track</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-4">
            Order #{order.id}
            {order.status === 'Cancelled' && (
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold border border-red-100">
                Cancelled
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1">Placed on {order.date} at {order.time}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {(order.status === 'Pending' || order.status === 'Confirmed') && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="bg-white hover:bg-red-50 text-red-500 px-6 py-4 rounded-2xl text-sm font-bold border border-slate-100 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm"
            >
              <XCircle size={18} />
              Cancel Order
            </button>
          )}
          <div className="bg-white border border-slate-100 flex flex-col items-center px-6 py-3 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Est. Arrival</span>
            <span className="text-xl font-bold text-primary-500">{order.status === 'Cancelled' ? '--:--' : (order.estimatedDeliveryTime || '...')}</span>
          </div>
          <div className={cn(
            "px-6 py-4 rounded-2xl text-sm font-bold border whitespace-nowrap",
            order.status === 'Pending' && "bg-slate-50 text-slate-500 border-slate-100",
            order.status === 'Confirmed' && "bg-sky-50 text-sky-600 border-sky-100",
            order.status === 'Preparing' && "bg-amber-50 text-amber-600 border-amber-100",
            order.status === 'Out for Delivery' && "bg-indigo-50 text-indigo-600 border-indigo-100",
            order.status === 'Delivered' && "bg-secondary-50 text-secondary-600 border-secondary-100",
            order.status === 'Cancelled' && "bg-red-50 text-red-600 border-red-100"
          )}>
            {order.status}
          </div>
        </div>
      </div>

      {/* Order Progress Stepper */}
      {!isCancelled && (
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="relative flex justify-between">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                className="h-full bg-primary-500"
              />
            </div>

            {statusSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      backgroundColor: isCompleted || isCurrent ? '#f43f5e' : '#f8fafc',
                      color: isCompleted || isCurrent ? '#ffffff' : '#94a3b8',
                      scale: isCurrent ? 1.1 : 1
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-slate-100",
                      isCurrent && "ring-primary-100 animate-pulse"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                  </motion.div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest hidden md:block",
                    isCurrent ? "text-primary-600" : isCompleted ? "text-slate-800" : "text-slate-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tracking Visualization */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-12 top-0 bottom-0 w-[2px] bg-slate-100 md:left-16" />
          
          <div className="space-y-12 relative z-10">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="relative">
                  {step.status === 'completed' ? (
                    <div className="w-8 h-8 rounded-full bg-secondary-600 flex items-center justify-center text-white ring-4 ring-secondary-50">
                      <CheckCircle2 size={16} />
                    </div>
                  ) : step.status === 'current' ? (
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white ring-4 ring-primary-50 animate-pulse">
                      <Circle size={16} fill="currentColor" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <Circle size={16} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h3 className={cn(
                      "font-bold text-lg",
                      step.status === 'completed' ? "text-slate-800" : 
                      step.status === 'current' ? "text-primary-600" : "text-slate-400"
                    )}>
                      {step.label}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">{step.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
      {/* Review Section */}
      {order.status === 'Delivered' && !order.reviewed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary-50 rounded-[32px] p-8 border border-primary-100 shadow-sm space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                  <Star className="text-secondary-500" fill="currentColor" size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Rate Your Meal</h3>
                <p className="text-xs text-slate-500 mt-1">Tell us how was {order.vendorName}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={32} 
                        fill={(hoveredRating || rating) >= star ? "currentColor" : "none"}
                        className={cn(
                          "transition-colors",
                          (hoveredRating || rating) >= star ? "text-secondary-500" : "text-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white rounded-2xl py-3 px-4 text-xs border border-slate-100 focus:ring-2 focus:ring-primary-100 outline-none transition-all min-h-[80px] resize-none"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || rating === 0}
                  className="w-full bg-primary-500 text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/10 hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : 'Submit Review'}
                </button>
              </div>
            </motion.div>
          )}

          {order.reviewed && (
            <div className="bg-secondary-50 rounded-[32px] p-6 border border-secondary-100 space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-secondary-500 shadow-sm mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-slate-800">Reviewed</h3>
              <p className="text-xs text-slate-500">Thanks for your feedback!</p>
            </div>
          )}

          {/* Cancel Confirmation Modal */}
          <AnimatePresence>
            {showCancelConfirm && (
              <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCancelConfirm(false)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10 space-y-6"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
                    <AlertTriangle size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-800">Cancel Order?</h3>
                    <p className="text-slate-500 text-sm mt-2">
                      Are you sure you want to cancel this order? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 px-6 py-3 rounded-2xl text-sm font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      className="flex-1 px-6 py-3 rounded-2xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden h-[300px] shadow-sm">
            <LiveTrackingMap status={order.status} />
          </div>
        </div>
      </div>

      {/* Order Details Summary */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <h2 className="text-xl font-display font-bold text-slate-800 mb-6">Order Details</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm py-2 border-b border-slate-50">
            <span className="text-slate-500">Vendor</span>
            <span className="font-bold text-slate-800">{order.vendorName}</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-slate-50">
            <span className="text-slate-500">Items</span>
            <span className="font-bold text-slate-800">{order.items.length}</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-slate-50">
            <span className="text-slate-500">Delivery Address</span>
            <span className="font-bold text-slate-800 text-right max-w-[200px]">{order.address || 'Standard Campus Delivery'}</span>
          </div>
          {order.deliveryPreference && (
            <div className="flex justify-between text-sm py-2 border-b border-slate-50">
              <span className="text-slate-500">Delivery Preference</span>
              <span className="font-bold text-primary-600">{order.deliveryPreference}</span>
            </div>
          )}
          {order.deliveryInstructions && (
            <div className="flex justify-between text-sm py-2 border-b border-slate-50">
              <span className="text-slate-500">Instructions</span>
              <span className="font-bold text-slate-800 text-right max-w-[200px] italic">"{order.deliveryInstructions}"</span>
            </div>
          )}
          <div className="flex justify-between text-sm py-2">
            <span className="font-display font-bold text-slate-800 text-lg uppercase">Total</span>
            <span className="font-display font-bold text-primary-600 text-lg">GHS {order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <button className="w-full mt-6 bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
          View Full Order Details <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
}
