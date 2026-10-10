import React, { useState, useEffect, useCallback } from 'react';
import {
  Receipt,
  Search,
  Calendar,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react';
import { Sale } from '../../domain/models/Sale';
import { useSales } from '../../application/hooks/useSales';
import { Pagination } from '../../shared/components/Pagination';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { formatDateTime } from '../../shared/utils/formatters';

export const SalesHistoryPage: React.FC = () => {
  // Default to past 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const [fromDate, setFromDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState<string>(now.toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { sales, pagination, isLoading, error, listSales } = useSales();

  const fetchSalesData = useCallback(() => {
    const fromIso = `${fromDate}T00:00:00.000Z`;
    const toIso = `${toDate}T23:59:59.999Z`;

    listSales({
      from: fromIso,
      to: toIso,
      page: currentPage,
      size: 15,
    });
  }, [fromDate, toDate, currentPage, listSales]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSalesData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Historial de Ventas</h1>
        <p className="text-sm text-slate-500">Consulta de transacciones y comprobantes emitidos</p>
      </div>

      <ErrorMessage error={error} onDismiss={() => fetchSalesData()} />

      {/* Date Range Filter Bar */}
      <form
        onSubmit={handleFilter}
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <label className="text-xs font-semibold text-slate-600">Desde:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Hasta:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Filtrar</span>
          </button>
        </div>

        <button
          type="button"
          onClick={fetchSalesData}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors self-end sm:self-auto"
          title="Recargar"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </form>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">ID Comprobante</th>
                <th className="px-6 py-3.5">Fecha y Hora (UTC)</th>
                <th className="px-6 py-3.5">Vendedor</th>
                <th className="px-6 py-3.5">Ítems</th>
                <th className="px-6 py-3.5">Total (COP)</th>
                <th className="px-6 py-3.5 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Cargando ventas...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    No se registraron ventas en el período seleccionado.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900">
                      {sale.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700">
                      {formatDateTime(sale.soldAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {sale.soldBy}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {sale.items.reduce((acc, i) => acc + i.quantity, 0)} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700">
                      {sale.total.format()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                        title="Ver detalle de la venta"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            size={pagination.size}
            onPageChange={(p) => setCurrentPage(p)}
          />
        )}
      </div>

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Detalle de Venta</h3>
              </div>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400">ID Venta:</span>
                  <p className="font-mono font-bold text-slate-800 truncate">{selectedSale.id}</p>
                </div>
                <div>
                  <span className="text-slate-400">Fecha:</span>
                  <p className="font-medium text-slate-800">{formatDateTime(selectedSale.soldAt)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Vendedor:</span>
                  <p className="font-bold text-slate-800">{selectedSale.soldBy}</p>
                </div>
                <div>
                  <span className="text-slate-400">Moneda:</span>
                  <p className="font-bold text-slate-800">{selectedSale.currency}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Artículos Facturados
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl overflow-hidden">
                  {selectedSale.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-slate-900">{item.productName}</div>
                        <div className="text-slate-500">
                          {item.quantity} x {item.unitPrice.format()}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">{item.subtotal.format()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Total Venta:</span>
                <span className="text-lg font-black text-emerald-700">{selectedSale.total.format()}</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSale(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
