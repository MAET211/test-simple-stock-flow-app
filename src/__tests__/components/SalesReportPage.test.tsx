import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SalesReportPage } from '../../features/reports/SalesReportPage';
import { AuthProvider } from '../../application/state/AuthContext';
import { salesReportService } from '../../infrastructure/services/SalesReportService';
import { Money } from '../../domain/value-objects/Money';

describe('SalesReportPage Component', () => {
  beforeEach(() => {
    vi.spyOn(salesReportService, 'getSalesReport').mockResolvedValue({
      from: new Date('2026-01-01T00:00:00Z'),
      to: new Date('2026-02-01T00:00:00Z'),
      salesCount: 4,
      grandTotal: Money.ofDecimal(120000, 'COP'),
      currency: 'COP',
      rows: [
        {
          productId: 'prod-1',
          productName: 'Brocha 2 Pulgadas',
          categoryName: 'Herramientas',
          unitsSold: 10,
          revenue: Money.ofDecimal(120000, 'COP'),
        },
      ],
    });
  });

  it('renders sales report metrics and aggregated table', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <SalesReportPage />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Reporte Consolidado de Ventas')).toBeInTheDocument();
    expect(await screen.findByText('Brocha 2 Pulgadas')).toBeInTheDocument();
    expect(screen.getByText('Herramientas')).toBeInTheDocument();
    expect(screen.getByText(/10 un/i)).toBeInTheDocument();
  });
});
