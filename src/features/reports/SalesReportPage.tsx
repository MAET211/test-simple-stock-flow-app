import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Calendar,
  Search,
  DollarSign,
  TrendingUp,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';
import { useSalesReport } from '../../application/hooks/useSalesReport';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { formatDateTime } from '../../shared/utils/formatters';

export const SalesReportPage: React.FC = () => {
  // Default to current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const [fromDate, setFromDate] = useState<string>(firstDay.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState<string>(now.toISOString().split('T')[0]);

  const { report, isLoading, error, fetchReport } = useSalesReport();

  const handleFetch = useCallback(() => {
    const fromIso = `${fromDate}T00:00:00.000Z`;
    const toIso = `${toDate}T23:59:59.999Z`;

    fetchReport({
      from: fromIso,
      to: toIso,
    });
  }, [fromDate, toDate, fetchReport]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetch();
  };

  const totalUnitsSold = report?.rows.reduce((acc, r) => acc + r.unitsSold, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reporte Consolidado de Ventas</h1>
        <p className="text-sm text-slate-500">
          Métricas de facturación, volumen y recaudación agrupadas por producto y categoría (ADR-006)
        </p>
      </div>

      <ErrorMessage error={error} onDismiss={() => handleFetch()} />

      {/* Date Range Controls */}
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
            <span>Generar Reporte</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleFetch}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors self-end sm:self-auto"
          title="Actualizar datos"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </form>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Facturado</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {report ? report.grandTotal.format() : '$0'}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">Moneda del sistema: COP</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transacciones</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {report ? report.salesCount : 0}
            </div>
            <div className="text-[11px] text-slate-500">Ventas confirmadas</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades Vendidas</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {totalUnitsSold}
            </div>
            <div className="text-[11px] text-slate-500">Productos entregados</div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Detalle de Ventas por Producto</h3>
          {report && (
            <span className="text-xs text-slate-500">
              Período: {formatDateTime(report.from)} — {formatDateTime(report.to)}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Producto (Nombre Congelado)</th>
                <th className="px-6 py-3.5">Categoría</th>
                <th className="px-6 py-3.5 text-center">Unidades Vendidas</th>
                <th className="px-6 py-3.5 text-right">Recaudación (COP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && !report ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Generando reporte...
                  </td>
                </tr>
              ) : !report || report.rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500">
                    <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    No hay registros de ventas para el rango seleccionado.
                  </td>
                </tr>
              ) : (
                report.rows.map((row, idx) => (
                  <tr key={`${row.productId}-${idx}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{row.productName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {row.productId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {row.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">
                      {row.unitsSold}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-700">
                      {row.revenue.format()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {report && report.rows.length > 0 && (
              <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
                <tr>
                  <td className="px-6 py-4" colSpan={2}>
                    Total General
                  </td>
                  <td className="px-6 py-4 text-center">
                    {totalUnitsSold} un.
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-800 text-base">
                    {report.grandTotal.format()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
