import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCatalogPage } from '../../features/products/ProductCatalogPage';
import { AuthProvider } from '../../application/state/AuthContext';
import { CartProvider } from '../../application/state/CartContext';
import { productCatalogService } from '../../infrastructure/services/ProductCatalogService';
import { categoryService } from '../../infrastructure/services/CategoryService';
import { Money } from '../../domain/value-objects/Money';

describe('ProductCatalogPage Component', () => {
  beforeEach(() => {
    vi.spyOn(categoryService, 'listCategories').mockResolvedValue([
      { id: 'cat-1', name: 'Herramientas' },
      { id: 'cat-2', name: 'Pinturas' },
    ]);

    vi.spyOn(productCatalogService, 'listProducts').mockResolvedValue({
      items: [
        {
          id: 'prod-1',
          name: 'Taladro Percutor',
          price: Money.ofDecimal(150000, 'COP'),
          stock: 8,
          categoryId: 'cat-1',
          categoryName: 'Herramientas',
          imageUrl: null,
        },
      ],
      page: 1,
      size: 15,
      total: 1,
      totalPages: 1,
    });
  });

  it('renders products table with item information and actions', async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ProductCatalogPage />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    );

    expect(screen.getByText('Catálogo de Productos')).toBeInTheDocument();
    expect(await screen.findByText('Taladro Percutor')).toBeInTheDocument();
    expect(screen.getAllByText('Herramientas').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/8 un/i)).toBeInTheDocument();
  });
});
