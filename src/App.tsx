import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './application/state/AuthContext';
import { CartProvider } from './application/state/CartContext';
import { router } from './router';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
