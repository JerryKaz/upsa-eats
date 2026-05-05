import React from 'react';
import { useOrderStore, useCartStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function OrdersPage() {
  const { orders, cancelOrder } = useOrderStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState('All');
  
  const filters = ['All', 'Pending', 'Preparing', 'Completed', 'Cancelled'];

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter || (filter === 'Completed' && o.status === 'Delivered'));

  const handleReorder = (e: React.MouseEvent, order: any) => {
    e.stopPropagation(); // Prevent row click navigation
    order.items.forEach((item: any) => {
      addToCart(item);
    });
    navigate('/cart');
  };

  const handleCancelOrder = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
      toast.success('Order cancelled');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-slate-800">My Orders</h1>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800">Orders</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-100 overflow-x-auto pb-px">
        {filters.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-6 py-4 font-bold text-sm transition-all relative",
              filter === tab
                ? "text-primary-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-600"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
            <Package size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
          <p className="text-slate-500 mt-2">Try different filter or order something delicious!</p>
        </div>
      ) : (
        <>
          {/* Table for Desktop */}
          <div className="hidden md:block overflow-hidden">
            <table className="w-full text-left bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm border-separate border-spacing-0">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Estimated Arrival</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <td className="px-8 py-6 font-bold text-slate-800">{order.id}</td>
                    <td className="px-8 py-6 text-slate-600 font-medium">{order.vendorName}</td>
                    <td className="px-8 py-6 text-slate-500">{order.date}</td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-700 font-bold">
                        <Clock size={14} className="text-primary-500" />
                        {order.estimatedDeliveryTime || 'Calculating...'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap",
                        order.status === 'Pending' && "bg-slate-50 text-slate-500 border-slate-100",
                        order.status === 'Confirmed' && "bg-sky-50 text-sky-600 border-sky-100",
                        order.status === 'Preparing' && "bg-amber-50 text-amber-600 border-amber-100",
                        order.status === 'Out for Delivery' && "bg-indigo-50 text-indigo-600 border-indigo-100",
                        order.status === 'Delivered' && "bg-secondary-50 text-secondary-600 border-secondary-100",
                        order.status === 'Cancelled' && "bg-red-50 text-red-600 border-red-100"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 text-primary-500 font-bold text-xs uppercase tracking-widest">
                        View Details
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{order.vendorName}</h4>
                    <p className="text-xs text-slate-400 font-medium">#{order.id} • {order.date}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
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
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                    <Clock size={14} className="text-primary-500" />
                    {order.estimatedDeliveryTime || '...'}
                  </div>
                  <div className="flex items-center gap-2">
                    {(order.status === 'Pending' || order.status === 'Confirmed') && (
                      <button 
                        onClick={(e) => handleCancelOrder(e, order.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => handleReorder(e, order)}
                      className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-500 hover:text-white transition-all"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-center">
        <button className="bg-white border border-slate-200 px-8 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:border-primary-200 hover:text-primary-600 transition-all">
          View All Orders
        </button>
      </div>
    </div>
  );
}
