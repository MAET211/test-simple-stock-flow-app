import { useState, useCallback } from 'react';
import { PagedSales, Sale } from '../../domain/models/Sale';
import { saleService } from '../../infrastructure/services/SaleService';
import { CreateSaleRequestDto } from '../../infrastructure/http/dto/api.dto';
import { SaleQueryParams } from '../ports/SalePort';

export const useSales = () => {
  const [data, setData] = useState<PagedSales | null>(null);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeSale = useCallback(async (dto: CreateSaleRequestDto): Promise<{ id: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      return await saleService.placeSale(dto);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listSales = useCallback(async (params: SaleQueryParams): Promise<PagedSales> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await saleService.listSales(params);
      setData(result);
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

  const getSale = useCallback(async (id: string): Promise<Sale> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await saleService.getSale(id);
      setCurrentSale(result);
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
    sales: data?.items || [],
    pagination: data ? { page: data.page, size: data.size, total: data.total, totalPages: data.totalPages } : null,
    currentSale,
    isLoading,
    error,
    placeSale,
    listSales,
    getSale,
  };
};
