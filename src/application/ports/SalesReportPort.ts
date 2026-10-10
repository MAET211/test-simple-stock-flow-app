import { SalesReport } from '../../domain/models/SalesReport';

export interface SalesReportQueryParams {
  from: string;
  to: string;
}

export interface SalesReportPort {
  getSalesReport(params: SalesReportQueryParams): Promise<SalesReport>;
}
