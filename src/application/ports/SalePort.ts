import { Sale, PagedSales } from '../../domain/models/Sale';
import { CreateSaleRequestDto } from '../../infrastructure/http/dto/api.dto';

export interface SaleQueryParams {
  from: string;
  to: string;
  page?: number;
  size?: number;
}

export interface SalePort {
  placeSale(data: CreateSaleRequestDto): Promise<{ id: string }>;
  listSales(params: SaleQueryParams): Promise<PagedSales>;
  getSale(id: string): Promise<Sale>;
}
