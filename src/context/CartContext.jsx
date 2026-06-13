import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

let nextLineId = 1;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  /**
   * Add a pre-built hamper to the cart.
   * hamper: the Hamper object from the API
   */
  const addHamper = useCallback((hamper, quantity = 1) => {
    setItems((prev) => [
      ...prev,
      {
        lineId: nextLineId++,
        type: 'HAMPER',
        hamperId: hamper.id,
        name: hamper.name,
        boxSize: hamper.boxSize,
        unitPrice: hamper.price,
        quantity,
        contents: hamper.items || [],
        imageUrl: hamper.imageUrl,
      },
    ]);
  }, []);

  /**
   * Add a custom-built hamper to the cart.
   * customItems: array of { productId, name, sellingPrice, quantity }
   */
  const addCustomHamper = useCallback((customItems, boxSize, name = 'Custom Hamper', note = '') => {
    const unitPrice = customItems.reduce((sum, it) => sum + it.sellingPrice * it.quantity, 0);

    setItems((prev) => [
      ...prev,
      {
        lineId: nextLineId++,
        type: 'CUSTOM',
        name,
        boxSize,
        unitPrice,
        quantity: 1,
        contents: customItems,
        note,
      },
    ]);
  }, []);

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = {
    items,
    addHamper,
    addCustomHamper,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
