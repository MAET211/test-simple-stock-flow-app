import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AuthSession, UserRole } from '../../domain/models/User';
import { LoginCredentials } from '../ports/AuthPort';
import { authService } from '../../infrastructure/services/AuthService';
import { httpClient } from '../../infrastructure/http/FetchHttpClient';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  role: UserRole | null;
  username: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'stockflow_auth_session';

const getStoredSession = (): AuthSession | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          expiresAt: new Date(parsed.expiresAt),
        };
      }
    }
  } catch {
    // ignore
  }
  return null;
};

const removeStoredSession = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
};

const saveStoredSession = (session: AuthSession) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken: session.accessToken,
          expiresAt: session.expiresAt.toISOString(),
          username: session.username,
          role: session.role,
        })
      );
    }
  } catch {
    // ignore
  }
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());

  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    removeStoredSession();
    setSession(null);
  }, []);

  useEffect(() => {
    httpClient.setTokenProvider(() => session?.accessToken || null);
    httpClient.setUnauthorizedHandler(logout);
  }, [session, logout]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const newSession = await authService.login(credentials);
      saveStoredSession(newSession);
      setSession(newSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      isAdmin: session?.role === 'admin',
      isSeller: session?.role === 'seller',
      role: session?.role || null,
      username: session?.username || null,
      login,
      logout,
      isLoading,
    }),
    [session, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
