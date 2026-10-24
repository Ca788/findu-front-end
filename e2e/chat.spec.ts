import { expect, test } from './fixtures';

test.describe('Chat', () => {
  test('envia uma mensagem, ela aparece na conversa e persiste após reload', async ({
    authedPage: page,
  }) => {
    const text = `Olá Findu, teste e2e ${Date.now()}`;

    await page.goto('/chat');
    const composer = page.getByPlaceholder('Pergunte ao Findu…');
    await composer.fill(text);

    const persisted = page.waitForResponse(
      (res) =>
        res.request().method() === 'POST' && /\/messages$/.test(res.url()) && res.ok(),
    );
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    const bubble = page.getByRole('main').getByText(text);
    await expect(bubble).toBeVisible();
    await expect(page).toHaveURL(/\/chat\/c\?id=/);

    await persisted;
    await page.reload();
    await expect(bubble).toBeVisible();

    await expect(page.getByPlaceholder('Pergunte ao Findu…')).toBeEditable();
  });
});
