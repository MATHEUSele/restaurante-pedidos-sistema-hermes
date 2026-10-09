import { test, expect } from '@playwright/test';

test.describe('Pedidos API', () => {
  // Ignoramos testes de db real no pipeline simples se não tiver docker, 
  // mas aqui deixamos o teste da API configurado.
  test('Deve retornar 400 se faltar restauranteId no POST', async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: {
        itens: [{ nomeProduto: 'Pastel', quantidade: 1, precoUnitario: 5.0 }]
      }
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing required fields');
  });

  test('Deve retornar 400 se faltar itens no POST', async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: {
        restauranteId: 'rest-pastelaria-do-galo'
      }
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing required fields');
  });

  // Nota: Não fazemos um teste de criação completo sem mock ou BD de teste garantido,
  // mas a rota está protegida contra payloads mal formados.
});
