import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('A resposta da Home deve conter headers de segurança', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();

    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
    expect(headers['strict-transport-security']).toContain('max-age=31536000');
    expect(headers['content-security-policy']).toContain("default-src 'self'");
  });

  test('A API deve conter headers de segurança', async ({ request }) => {
    const response = await request.get('/api/health');
    const headers = response.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['strict-transport-security']).toContain('max-age=31536000');
  });
});
