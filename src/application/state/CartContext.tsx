import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Product } from '../../domain/models/Product';
import { Money } from '../../domain/value-objects/Money';

export interface CartLine {
  product: Product;
  quantity: number;
  subtotal: Money;
}

interface CartContextValue {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: Money;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;

    setLines((prev) => {
      const existingIndex = prev.findIndex((l) => l.product.id === product.id);
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        const updated = [...prev];
        updated[existingIndex] = {
          product,
          quantity: newQty,
          subtotal: product.price.multiply(newQty),
        };
        return updated;
      }

      const initialQty = Math.min(product.stock, quantity);
      return [
        ...prev,
        {
          product,
          quantity: initialQty,
          subtotal: product.price.multiply(initialQty),
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((l) => l.product.id !== productId);
      }

      return prev.map((l) => {
        if (l.product.id === productId) {
          const clampedQty = Math.min(l.product.stock, quantity);
          return {
            ...l,
            quantity: clampedQty,
            subtotal: l.product.price.multiply(clampedQty),
          };
        }
        return l;
      });
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const total = useMemo(() => {
    return lines.reduce((acc, curr) => acc.add(curr.subtotal), Money.zero('COP'));
  }, [lines]);

  const itemCount = useMemo(() => {
    return lines.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      total,
      itemCount,
    }),
    [lines, addItem, updateQuantity, removeItem, clearCart, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
