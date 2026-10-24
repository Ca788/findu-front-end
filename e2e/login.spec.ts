import { expect, test } from './fixtures';

test.describe('Login', () => {
  test('entra com credenciais válidas e cai no dashboard', async ({ page, apiUser }) => {
    await page.goto('/login');

    await page.getByLabel('Seu e-mail').fill(apiUser.email);
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.getByText(apiUser.email)).toBeVisible();
    await page.getByLabel('Sua senha', { exact: true }).fill(apiUser.password);
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('alert').filter({ hasText: 'Login realizado com sucesso' })).toBeVisible();
  });

  test('mostra erro com senha incorreta e permanece no login', async ({ page, apiUser }) => {
    await page.goto('/login');

    await page.getByLabel('Seu e-mail').fill(apiUser.email);
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByLabel('Sua senha', { exact: true }).fill('senha-errada-123');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.locator('.MuiAlert-colorError')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('rota protegida redireciona para o login preservando `next`', async ({ page }) => {
    await page.goto('/chat');
    await expect(page).toHaveURL(/\/login\?next=%2Fchat/);
  });
});
