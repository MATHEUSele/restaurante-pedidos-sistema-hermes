import { test, expect } from '@playwright/test';

test('login should work with admin credentials', async ({ page }) => {
  // O teste deve garantir que o frontend subiu com sucesso navegando até a página de login
  await page.goto('/login');

  // Aguarda a página carregar verificando se o título Hermes está presente
  await expect(page.locator('h1', { hasText: 'Hermes' })).toBeVisible();

  // Garante que a tab "Entrar" está selecionada (login form)
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Preenche as credenciais do usuário admin
  await page.getByPlaceholder('admin@hermes.com').fill('adm@gmail.com');
  await page.getByPlaceholder('••••••••').first().fill('123');

  // Clica no botão de enviar (Entrar)
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Verifica se o redirecionamento ocorreu com sucesso (por exemplo, redireciona para /dev)
  // Como o comportamento descrito no código é redirecionar para /dev
  await page.waitForURL('**/dev');

  // Se chegou até aqui, significa que logou com sucesso
  expect(page.url()).toContain('/dev');
});
