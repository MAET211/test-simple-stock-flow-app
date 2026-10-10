import { UserPort } from '../../application/ports/UserPort';
import { RegisterSellerRequestDto } from '../http/dto/api.dto';
import { httpClient } from '../http/FetchHttpClient';

export class UserService implements UserPort {
  public async registerSeller(data: RegisterSellerRequestDto): Promise<void> {
    await httpClient.post<void>('/api/auth/register', data);
  }
}

export const userService = new UserService();
