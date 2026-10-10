import { AuthSession } from '../../domain/models/User';
import { AuthResultDto } from '../http/dto/api.dto';

export class AuthMapper {
  public static toDomain(dto: AuthResultDto): AuthSession {
    return {
      accessToken: dto.accessToken,
      expiresAt: new Date(dto.expiresAt),
      username: dto.username,
      role: dto.role,
    };
  }
}
