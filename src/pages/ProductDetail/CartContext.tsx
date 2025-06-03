import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../../interfaces/product';

interface CartContextType {
  cartItemCount: number;
  addToCart: (product: Product) => void;
  products: Product[];
  updateProductQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  removeProduct: (id: string) => void;
  getTotalPrice: () => number;
  sumQuantity: ()   => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState<number>(() => {
    const savedCount = sessionStorage.getItem('cartItemCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = sessionStorage.getItem('cartProducts');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cartItemCount', cartItemCount.toString());
    sessionStorage.setItem('cartProducts', JSON.stringify(products));
  }, [cartItemCount, products]);

  const addToCart = (product: Product) => {
    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
        return [...prevProducts];
      } else {
        return [...prevProducts, product];
      }
    });
    setCartItemCount((prevCount) => prevCount + product.quantity);
  };

  const updateProductQuantity = (id: string, quantity: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
          product.id === id ? { ...product, quantity } : product
      );
      const newCartItemCount = updatedProducts.reduce((sum, product) => sum + product.quantity, 0);
      setCartItemCount(newCartItemCount);
      return updatedProducts;
    });
  };

  const removeProduct = (id: string) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter((product) => product.id !== id);
      const newCartItemCount = updatedProducts.reduce((sum, product) => sum + product.quantity, 0);
      setCartItemCount(newCartItemCount);
      return updatedProducts;
    });
  };

  const clearCart = () => {
    setProducts([]);
    setCartItemCount(0);
  };

  const getTotalPrice = () => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };
  const sumQuantity = () => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };
  return (
      <CartContext.Provider value={{sumQuantity, cartItemCount, addToCart, products, updateProductQuantity, removeProduct, getTotalPrice, clearCart }}>
        {children}
      </CartContext.Provider>
  );
};
