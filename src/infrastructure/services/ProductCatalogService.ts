import { ProductCatalogPort, ProductQueryParams } from '../../application/ports/ProductCatalogPort';
import { Product, PagedProducts } from '../../domain/models/Product';
import { ProductDto, PagedResultDto, CreateProductRequestDto, UpdateProductRequestDto } from '../http/dto/api.dto';
import { httpClient } from '../http/FetchHttpClient';
import { ProductMapper } from '../mappers/ProductMapper';

export class ProductCatalogService implements ProductCatalogPort {
  public async listProducts(params?: ProductQueryParams): Promise<PagedProducts> {
    const dto = await httpClient.get<PagedResultDto<ProductDto>>('/api/products', {
      params: {
        search: params?.search,
        categoryId: params?.categoryId,
        page: params?.page,
        size: params?.size,
      },
    });
    return ProductMapper.toPagedDomain(dto);
  }

  public async getProduct(id: string): Promise<Product> {
    const dto = await httpClient.get<ProductDto>(`/api/products/${id}`);
    return ProductMapper.toDomain(dto);
  }

  public async createProduct(data: CreateProductRequestDto): Promise<{ id: string }> {
    return httpClient.post<{ id: string }>('/api/products', data);
  }

  public async updateProduct(id: string, data: UpdateProductRequestDto): Promise<{ id: string }> {
    return httpClient.put<{ id: string }>(`/api/products/${id}`, data);
  }

  public async deleteProduct(id: string): Promise<void> {
    await httpClient.delete<void>(`/api/products/${id}`);
  }

  public async uploadImage(id: string, file: File): Promise<{ url: string }> {
    return httpClient.upload<{ url: string }>(`/api/products/${id}/image`, file);
  }
}

export const productCatalogService = new ProductCatalogService();
