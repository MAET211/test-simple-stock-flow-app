import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FetchHttpClient } from '../../infrastructure/http/FetchHttpClient';

describe('FetchHttpClient', () => {
  let client: FetchHttpClient;
  const originalFetch = global.fetch;

  beforeEach(() => {
    client = new FetchHttpClient();
    vi.stubGlobal('fetch', vi.fn());
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('injects Authorization header when token is set via setToken', async () => {
    client.setToken('test-token-123');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: 'ok' }),
    });

    await client.get('/api/categories');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, options] = (global.fetch as any).mock.calls[0];
    const headers = options.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-token-123');
  });

  it('reads token from localStorage if in-memory token is not explicitly set', async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('stockflow_access_token', 'stored-jwt-token');
    }

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: 'ok' }),
    });

    await client.get('/api/products');

    const [, options] = (global.fetch as any).mock.calls[0];
    const headers = options.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer stored-jwt-token');
  });

  it('calls unauthorizedHandler on 401 for normal API requests', async () => {
    const unauthorizedHandler = vi.fn();
    client.setUnauthorizedHandler(unauthorizedHandler);
    client.setToken('expired-token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Headers(),
    });

    await expect(client.get('/api/products')).rejects.toThrow();
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1);
  });

  it('does NOT call unauthorizedHandler on 401 for login request', async () => {
    const unauthorizedHandler = vi.fn();
    client.setUnauthorizedHandler(unauthorizedHandler);

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Headers(),
    });

    await expect(client.post('/api/auth/login', { username: 'foo', password: 'bar' })).rejects.toThrow();
    expect(unauthorizedHandler).not.toHaveBeenCalled();
  });
});
