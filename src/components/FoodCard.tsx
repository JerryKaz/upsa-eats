import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { FoodItem } from '../types';
import { useCartStore } from '../store/useCartStore';
import { cn } from '../lib/utils';

interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const cartItem = cartItems.find((i) => i.id === food.id);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart(food);
    
    // Trigger animation
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    window.dispatchEvent(new CustomEvent('cart-item-added', {
      detail: { startX, startY }
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-4 flex gap-4 border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
        <img 
          src={food.image} 
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-slate-800">
              {food.name}
            </h4>
            <span className="font-bold text-primary-600">
              GHS {food.price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>
        
        <div className="flex justify-end mt-2">
          {cartItem ? (
            <div className="flex items-center gap-3 bg-primary-50 rounded-full px-2 py-1 border border-primary-100">
              <button 
                onClick={() => updateQuantity(food.id, cartItem.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-primary-500 shadow-sm hover:bg-primary-500 hover:text-white transition-all"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-primary-700 min-w-[20px] text-center">
                {cartItem.quantity}
              </span>
              <button 
                onClick={handleAddToCart}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-primary-500 shadow-sm hover:bg-primary-500 hover:text-white transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="w-9 h-9 flex items-center justify-center bg-primary-500 text-white rounded-full shadow-lg hover:shadow-primary-500/30 hover:scale-110 transition-all active:scale-95"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
