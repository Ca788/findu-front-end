import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

const devOverlay = (page: Page) => page.locator('nextjs-portal');

test.describe('Visual', () => {
  test('tela de login (etapa e-mail)', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Seu e-mail')).toBeVisible();
    await expect(page).toHaveScreenshot('login-email-step.png', {
      fullPage: true,
      mask: [devOverlay(page)],
    });
  });

  test('chat vazio', async ({ authedPage: page }) => {
    await page.goto('/chat');
    await expect(page.getByPlaceholder('Pergunte ao Findu…')).toBeVisible();
    await expect(page).toHaveScreenshot('chat-empty.png', {
      fullPage: true,
      mask: [page.getByText(/^Olá, /), devOverlay(page)],
    });
  });
});
