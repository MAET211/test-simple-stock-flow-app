import { SalesReportPort, SalesReportQueryParams } from '../../application/ports/SalesReportPort';
import { SalesReport } from '../../domain/models/SalesReport';
import { SalesReportDto } from '../http/dto/api.dto';
import { httpClient } from '../http/FetchHttpClient';
import { SalesReportMapper } from '../mappers/SalesReportMapper';

export class SalesReportService implements SalesReportPort {
  public async getSalesReport(params: SalesReportQueryParams): Promise<SalesReport> {
    const dto = await httpClient.get<SalesReportDto>('/api/reports/sales', {
      params: {
        from: params.from,
        to: params.to,
      },
    });
    return SalesReportMapper.toDomain(dto);
  }
}

export const salesReportService = new SalesReportService();
