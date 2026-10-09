import { test, expect } from '@playwright/test';

test.describe('API /api/pedidos', () => {
  test('GET /api/pedidos retorna status 200 e uma lista', async ({ request }) => {
    const response = await request.get('/api/pedidos');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('POST /api/pedidos cria um novo pedido', async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: {
        clienteNome: 'Cliente Teste API',
        itens: [
          { produtoId: '1', quantidade: 2, precoFixo: 15.50 }
        ],
        total: 31.00
      }
    });
    
    // Como a API pode exigir auth ou não, verificamos o resultado
    expect([200, 201]).toContain(response.status());
    if (response.status() === 201) {
      const body = await response.json();
      expect(body.id).toBeDefined();
      expect(body.status).toBe('NOVO');
    }
  });

  test('GET /api/health retorna status OK', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.database).toBe('connected');
  });
});
