import { UserPort } from '../../application/ports/UserPort';
import { RegisterSellerRequestDto } from '../http/dto/api.dto';
import { httpClient } from '../http/FetchHttpClient';

export class UserService implements UserPort {
  public async registerSeller(data: RegisterSellerRequestDto): Promise<void> {
    await httpClient.post<void>('/api/auth/register', {
      username: data.username,
      password: data.password,
      role: data.role ?? 'seller',
    });
  }
}

export const userService = new UserService();
