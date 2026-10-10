import { useState, useCallback } from 'react';
import { SalesReport } from '../../domain/models/SalesReport';
import { salesReportService } from '../../infrastructure/services/SalesReportService';
import { SalesReportQueryParams } from '../ports/SalesReportPort';

export const useSalesReport = () => {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (params: SalesReportQueryParams): Promise<SalesReport> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await salesReportService.getSalesReport(params);
      setReport(result);
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    report,
    isLoading,
    error,
    fetchReport,
  };
};
