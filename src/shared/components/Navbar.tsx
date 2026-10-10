import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  UserPlus,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../application/state/AuthContext';
import { useCart } from '../../application/state/CartContext';

export const Navbar: React.FC = () => {
  const { session, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClasses = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive(path)
        ? 'bg-emerald-700 text-white shadow-sm'
        : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
    }`;

  return (
    <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 shadow-inner">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline">Simple Stock Flow</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/productos" className={linkClasses('/productos')}>
                <Package className="w-4 h-4" />
                <span>Productos</span>
              </Link>

              <Link to="/ventas/nueva" className={linkClasses('/ventas/nueva')}>
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span>Punto de Venta</span>
              </Link>

              <Link to="/ventas" className={linkClasses('/ventas')}>
                <Receipt className="w-4 h-4" />
                <span>Historial</span>
              </Link>

              <Link to="/reportes/ventas" className={linkClasses('/reportes/ventas')}>
                <BarChart3 className="w-4 h-4" />
                <span>Reportes</span>
              </Link>

              {isAdmin && (
                <Link to="/vendedores/nuevo" className={linkClasses('/vendedores/nuevo')}>
                  <UserPlus className="w-4 h-4" />
                  <span>Nuevo Vendedor</span>
                </Link>
              )}
            </nav>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800 text-xs">
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-100">{session?.username}</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  isAdmin
                    ? 'bg-purple-900/80 text-purple-200 border border-purple-700'
                    : 'bg-emerald-800 text-emerald-200 border border-emerald-700'
                }`}
              >
                {isAdmin ? 'Administrador' : 'Vendedor'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-emerald-950/40 hover:bg-red-600/90 text-emerald-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-emerald-800 hover:border-red-500"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-emerald-800/80 text-xs">
          <Link to="/productos" className={linkClasses('/productos')}>
            <Package className="w-4 h-4" />
            <span>Productos</span>
          </Link>
          <Link to="/ventas/nueva" className={linkClasses('/ventas/nueva')}>
            <ShoppingCart className="w-4 h-4" />
            <span>Vender</span>
          </Link>
          <Link to="/ventas" className={linkClasses('/ventas')}>
            <Receipt className="w-4 h-4" />
            <span>Historial</span>
          </Link>
          <Link to="/reportes/ventas" className={linkClasses('/reportes/ventas')}>
            <BarChart3 className="w-4 h-4" />
            <span>Reportes</span>
          </Link>
          {isAdmin && (
            <Link to="/vendedores/nuevo" className={linkClasses('/vendedores/nuevo')}>
              <UserPlus className="w-4 h-4" />
              <span>Vendedor</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
