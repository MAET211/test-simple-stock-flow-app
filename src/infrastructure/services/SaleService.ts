import { SalePort, SaleQueryParams } from '../../application/ports/SalePort';
import { Sale, PagedSales } from '../../domain/models/Sale';
import { SaleDto, PagedResultDto, CreateSaleRequestDto } from '../http/dto/api.dto';
import { httpClient } from '../http/FetchHttpClient';
import { SaleMapper } from '../mappers/SaleMapper';

export class SaleService implements SalePort {
  public async placeSale(data: CreateSaleRequestDto): Promise<{ id: string }> {
    return httpClient.post<{ id: string }>('/api/sales', data);
  }

  public async listSales(params: SaleQueryParams): Promise<PagedSales> {
    const dto = await httpClient.get<PagedResultDto<SaleDto>>('/api/sales', {
      params: {
        from: params.from,
        to: params.to,
        page: params.page,
        size: params.size,
      },
    });
    return SaleMapper.toPagedDomain(dto);
  }

  public async getSale(id: string): Promise<Sale> {
    const dto = await httpClient.get<SaleDto>(`/api/sales/${id}`);
    return SaleMapper.toDomain(dto);
  }
}

export const saleService = new SaleService();
