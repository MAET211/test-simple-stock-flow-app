export type UserRole = 'admin' | 'seller';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface AuthSession {
  accessToken: string;
  expiresAt: Date;
  username: string;
  role: UserRole;
}
