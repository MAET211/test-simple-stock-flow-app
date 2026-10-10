import { Product, PagedProducts } from '../../domain/models/Product';
import { CreateProductRequestDto, UpdateProductRequestDto } from '../../infrastructure/http/dto/api.dto';

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  page?: number;
  size?: number;
}

export interface ProductCatalogPort {
  listProducts(params?: ProductQueryParams): Promise<PagedProducts>;
  getProduct(id: string): Promise<Product>;
  createProduct(data: CreateProductRequestDto): Promise<{ id: string }>;
  updateProduct(id: string, data: UpdateProductRequestDto): Promise<{ id: string }>;
  deleteProduct(id: string): Promise<void>;
  uploadImage(id: string, file: File): Promise<{ url: string }>;
}
