import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './shared/components/Layout';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { ProductCatalogPage } from './features/products/ProductCatalogPage';
import { NewSalePage } from './features/sales/NewSalePage';
import { SalesHistoryPage } from './features/sales/SalesHistoryPage';
import { SalesReportPage } from './features/reports/SalesReportPage';
import { RegisterSellerPage } from './features/users/RegisterSellerPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/productos" replace />,
      },
      {
        path: 'productos',
        element: <ProductCatalogPage />,
      },
      {
        path: 'ventas/nueva',
        element: <NewSalePage />,
      },
      {
        path: 'ventas',
        element: <SalesHistoryPage />,
      },
      {
        path: 'reportes/ventas',
        element: <SalesReportPage />,
      },
      {
        path: 'vendedores/nuevo',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <RegisterSellerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/productos" replace />,
      },
    ],
  },
]);
