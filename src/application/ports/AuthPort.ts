import { AuthSession } from '../../domain/models/User';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthPort {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): void;
}
