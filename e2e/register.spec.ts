import { buildUser, expect, test } from './fixtures';

test.describe('Registro', () => {
  test('cria a conta e entra autenticado no dashboard', async ({ page }) => {
    const user = buildUser('signup');

    await page.goto('/register');
    await page.getByLabel('Nome').fill(user.name);
    await page.getByLabel('E-mail').fill(user.email);
    await page.getByLabel('Senha', { exact: true }).fill(user.password);
    await page.getByLabel('Confirmar senha').fill(user.password);
    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('alert').filter({ hasText: 'Conta criada com sucesso' })).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('bloqueia envio quando as senhas não conferem', async ({ page }) => {
    const user = buildUser('signup-invalid');

    await page.goto('/register');
    await page.getByLabel('Nome').fill(user.name);
    await page.getByLabel('E-mail').fill(user.email);
    await page.getByLabel('Senha', { exact: true }).fill(user.password);
    await page.getByLabel('Confirmar senha').fill(`${user.password}x`);
    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page.getByText('Senhas não conferem')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });
});
