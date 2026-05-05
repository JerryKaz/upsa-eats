import React, { useEffect, useRef } from 'react';
import { useOrderStore } from '../store/useCartStore';
import { toast } from 'sonner';
import { Bell, Package, Bike, CheckCircle2, XCircle } from 'lucide-react';

export default function NotificationWatcher() {
  const { orders, updateOrderStatus } = useOrderStore();
  const processedStatusRef = useRef<Record<string, string>>({});

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Notify for all status changes (including Cancelled)
    orders.forEach(order => {
      // Initialize processed status tracking if not already there
      if (!processedStatusRef.current[order.id]) {
        processedStatusRef.current[order.id] = order.status;
      }

      // If status changed, notify
      if (processedStatusRef.current[order.id] !== order.status) {
        sendNotification(order);
        processedStatusRef.current[order.id] = order.status;
      }
    });

    // Simulate order life cycle for active orders
    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');

    activeOrders.forEach(order => {
      // Simulation logic: Progress status every 20-40 seconds for demo purposes
      if (order.status === 'Pending') {
        setTimeout(() => updateOrderStatus(order.id, 'Confirmed'), 10000);
      }
      if (order.status === 'Confirmed') {
        setTimeout(() => updateOrderStatus(order.id, 'Preparing'), 15000);
      }
      if (order.status === 'Preparing') {
        setTimeout(() => updateOrderStatus(order.id, 'Out for Delivery'), 20000);
      }
      if (order.status === 'Out for Delivery') {
        setTimeout(() => updateOrderStatus(order.id, 'Delivered'), 25000);
      }
    });
  }, [orders, updateOrderStatus]);

  const sendNotification = (order: any) => {
    const statusMessages: Record<string, { title: string, desc: string, icon: any }> = {
      'Confirmed': { 
        title: 'Order Confirmed', 
        desc: `${order.vendorName} has accepted your order #${order.id}`,
        icon: <CheckCircle2 className="text-green-500" size={18} />
      },
      'Preparing': { 
        title: 'Preparing your meal', 
        desc: `The chef is busy with your order from ${order.vendorName}`,
        icon: <Package className="text-amber-500" size={18} />
      },
      'Out for Delivery': { 
        title: 'Out for Delivery', 
        desc: `Your food is on the way! Watch for the courier.`,
        icon: <Bike className="text-primary-500" size={18} />
      },
      'Delivered': { 
        title: 'Enjoy your meal!', 
        desc: `Your order from ${order.vendorName} has been delivered.`,
        icon: <Bell className="text-secondary-500" size={18} />
      },
      'Cancelled': { 
        title: 'Order Cancelled', 
        desc: `Your order from ${order.vendorName} has been cancelled.`,
        icon: <XCircle className="text-red-500" size={18} />
      }
    };

    const msg = statusMessages[order.status];
    if (!msg) return;

    // Toast Notification
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4 min-w-[320px]">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
          {msg.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-sm">{msg.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{msg.desc}</p>
        </div>
        <button onClick={() => toast.dismiss(t)} className="text-slate-300 hover:text-slate-500">
          <Package size={14} className="rotate-45" />
        </button>
      </div>
    ), { duration: 5000 });

    // Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(msg.title, {
        body: msg.desc,
        icon: '/favicon.ico'
      });
    }
  };

  return null;
}
