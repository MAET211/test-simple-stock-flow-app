import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Search,
  Package,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../../application/state/CartContext';
import { useProducts } from '../../application/hooks/useProducts';
import { useSales } from '../../application/hooks/useSales';
import { ErrorMessage } from '../../shared/components/ErrorMessage';

export const NewSalePage: React.FC = () => {
  const { lines, addItem, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const { products, isLoading: isProductsLoading } = useProducts({ page: 1, size: 50 });
  const { placeSale, isLoading: isPlacingSale } = useSales();

  const [searchTerm, setSearchTerm] = useState('');
  const [successSaleId, setSuccessSaleId] = useState<string | null>(null);
  const [error, setError] = useState<unknown>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleConfirmSale = async () => {
    if (lines.length === 0) {
      setError('El carrito está vacío. Agrega al menos un producto para registrar la venta.');
      return;
    }

    setError(null);
    try {
      const payload = {
        lines: lines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
      };

      const result = await placeSale(payload);
      setSuccessSaleId(result.id);
      clearCart();
    } catch (err: unknown) {
      setError(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Punto de Venta (POS)</h1>
        <p className="text-sm text-slate-500">Registra ventas, descuenta inventario y emite comprobantes</p>
      </div>

      {successSaleId && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base font-bold text-emerald-900">¡Venta registrada exitosamente!</h3>
            <p className="text-xs text-emerald-700 mt-1">
              Comprobante registrado con ID: <span className="font-mono font-bold">{successSaleId}</span>
            </p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => setSuccessSaleId(null)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}

      <ErrorMessage error={error as Error} onDismiss={() => setError(null)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Selection Catalog */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar producto por nombre..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Productos Disponibles</span>
              <span>{filteredProducts.length} productos</span>
            </div>

            {isProductsLoading ? (
              <div className="text-center py-12 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                Cargando productos...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Package className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                No se encontraron productos disponibles.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-1">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isOutOfStock
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                          <span className="text-[10px] text-slate-500">{p.categoryName}</span>
                          <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                            {p.price.format()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-medium text-slate-500">
                          Stock: <span className={p.stock < 5 ? 'text-amber-600 font-bold' : 'text-slate-800'}>{p.stock}</span>
                        </span>
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => addItem(p, 1)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary / Cart */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sticky top-20">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Carrito de Venta</h3>
              </div>
              {lines.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Vaciar
                </button>
              )}
            </div>

            {lines.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
                <p className="text-sm font-medium text-slate-600">El carrito está vacío</p>
                <p className="text-xs text-slate-400 mt-1">Selecciona productos del catálogo para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {lines.map((line) => (
                    <div
                      key={line.product.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="font-semibold text-xs text-slate-900 truncate">{line.product.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {line.product.price.format()} x {line.quantity} ={' '}
                          <span className="font-bold text-slate-800">{line.subtotal.format()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-800">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={line.quantity >= line.product.stock}
                            onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg disabled:opacity-30 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(line.product.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals and Checkout */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Total de artículos:</span>
                    <span className="font-semibold text-slate-800">{itemCount} unidades</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900">
                    <span>Total a Cobrar:</span>
                    <span className="text-xl text-emerald-700">{total.format()}</span>
                  </div>

                  <button
                    onClick={handleConfirmSale}
                    disabled={isPlacingSale || lines.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <span>{isPlacingSale ? 'Procesando venta...' : 'Confirmar Venta'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
