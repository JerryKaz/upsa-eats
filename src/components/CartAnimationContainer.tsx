import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FlyingDot {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export default function CartAnimationContainer() {
  const [dots, setDots] = useState<FlyingDot[]>([]);

  const handleTriggerAnimation = useCallback((event: CustomEvent) => {
    const { startX, startY } = event.detail;
    const cartIcon = document.getElementById('cart-icon');
    
    if (!cartIcon) return;

    const rect = cartIcon.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;

    const id = Date.now();
    setDots((prev) => [...prev, { id, startX, startY, endX, endY }]);

    // Cleanup dot after animation
    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('cart-item-added' as any, handleTriggerAnimation as any);
    return () => {
      window.removeEventListener('cart-item-added' as any, handleTriggerAnimation as any);
    };
  }, [handleTriggerAnimation]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ 
              x: dot.startX, 
              y: dot.startY, 
              scale: 1, 
              opacity: 1 
            }}
            animate={{ 
              x: dot.endX, 
              y: dot.endY, 
              scale: 0.2, 
              opacity: 0.5 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for a "swoosh" feel
            }}
            className="fixed w-6 h-6 bg-primary-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
