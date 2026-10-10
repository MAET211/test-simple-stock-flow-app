import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NewSalePage } from '../../features/sales/NewSalePage';
import { AuthProvider } from '../../application/state/AuthContext';
import { CartProvider } from '../../application/state/CartContext';
import { productCatalogService } from '../../infrastructure/services/ProductCatalogService';
import { Money } from '../../domain/value-objects/Money';

describe('NewSalePage POS Component', () => {
  beforeEach(() => {
    vi.spyOn(productCatalogService, 'listProducts').mockResolvedValue({
      items: [
        {
          id: 'prod-1',
          name: 'Pintura Blanca 1 Galon',
          price: Money.ofDecimal(45000, 'COP'),
          stock: 12,
          categoryId: 'cat-2',
          categoryName: 'Pinturas',
          imageUrl: null,
        },
      ],
      page: 1,
      size: 50,
      total: 1,
      totalPages: 1,
    });
  });

  it('allows adding product to cart and computing total', async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <NewSalePage />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    );

    expect(screen.getByText('Punto de Venta (POS)')).toBeInTheDocument();
    expect(await screen.findByText('Pintura Blanca 1 Galon')).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(addBtn);

    expect(screen.getByText('Carrito de Venta')).toBeInTheDocument();
    expect(screen.getByText(/Total a Cobrar:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar venta/i })).toBeInTheDocument();
  });
});
