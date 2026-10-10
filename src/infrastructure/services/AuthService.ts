import { AuthPort, LoginCredentials } from '../../application/ports/AuthPort';
import { AuthSession } from '../../domain/models/User';
import { AuthResultDto } from '../http/dto/api.dto';
import { httpClient } from '../http/FetchHttpClient';
import { AuthMapper } from '../mappers/AuthMapper';

export class AuthService implements AuthPort {
  public async login(credentials: LoginCredentials): Promise<AuthSession> {
    const dto = await httpClient.post<AuthResultDto>('/api/auth/login', credentials);
    return AuthMapper.toDomain(dto);
  }

  public logout(): void {
    // Handled in state layer
  }
}

export const authService = new AuthService();
