import { useState, useCallback, useEffect } from 'react';
import { PagedProducts } from '../../domain/models/Product';
import { productCatalogService } from '../../infrastructure/services/ProductCatalogService';
import { CreateProductRequestDto, UpdateProductRequestDto } from '../../infrastructure/http/dto/api.dto';
import { ProductQueryParams } from '../ports/ProductCatalogPort';

export const useProducts = (initialParams?: ProductQueryParams) => {
  const [params, setParams] = useState<ProductQueryParams>(initialParams || { page: 1, size: 20 });
  const [data, setData] = useState<PagedProducts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (queryParams?: ProductQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const p = queryParams || params;
      const result = await productCatalogService.listProducts(p);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al cargar productos');
      }
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts(params);
  }, [params, fetchProducts]);

  const createProduct = useCallback(async (dto: CreateProductRequestDto): Promise<{ id: string }> => {
    const res = await productCatalogService.createProduct(dto);
    await fetchProducts(params);
    return res;
  }, [fetchProducts, params]);

  const updateProduct = useCallback(async (id: string, dto: UpdateProductRequestDto): Promise<{ id: string }> => {
    const res = await productCatalogService.updateProduct(id, dto);
    await fetchProducts(params);
    return res;
  }, [fetchProducts, params]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await productCatalogService.deleteProduct(id);
    await fetchProducts(params);
  }, [fetchProducts, params]);

  const uploadImage = useCallback(async (id: string, file: File): Promise<{ url: string }> => {
    const res = await productCatalogService.uploadImage(id, file);
    await fetchProducts(params);
    return res;
  }, [fetchProducts, params]);

  return {
    products: data?.items || [],
    pagination: data ? { page: data.page, size: data.size, total: data.total, totalPages: data.totalPages } : null,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  };
};
