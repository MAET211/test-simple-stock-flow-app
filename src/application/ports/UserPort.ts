import { RegisterSellerRequestDto } from '../../infrastructure/http/dto/api.dto';

export interface UserPort {
  registerSeller(data: RegisterSellerRequestDto): Promise<void>;
}
