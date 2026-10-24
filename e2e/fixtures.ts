import { test as base, expect, request as playwrightRequest, type Page } from '@playwright/test';
import { API_BASE_URL } from '../playwright.config';

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

export function buildUser(prefix = 'e2e'): TestUser {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    name: 'Usuário E2E',
    email: `${prefix}-${stamp}@findu.test`,
    password: 'Senha!123',
  };
}

export async function createUserViaApi(user: TestUser): Promise<void> {
  const api = await playwrightRequest.newContext();
  try {
    const response = await api.post(`${API_BASE_URL.replace(/\/$/, '')}/user`, {
      data: {
        user: {
          name: user.name,
          email: user.email,
          password: user.password,
          password_confirmation: user.password,
        },
      },
    });
    expect(response.status(), await response.text()).toBe(201);
  } finally {
    await api.dispose();
  }
}

export async function loginViaUi(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Seu e-mail').fill(user.email);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByLabel('Sua senha', { exact: true }).fill(user.password);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.waitForURL(/\/dashboard/);
}

type Fixtures = {
  apiUser: TestUser;
  authedPage: Page;
};

export const test = base.extend<Fixtures>({
  apiUser: async ({}, provide) => {
    const user = buildUser();
    await createUserViaApi(user);
    await provide(user);
  },
  authedPage: async ({ page, apiUser }, provide) => {
    await loginViaUi(page, apiUser);
    await provide(page);
  },
});

export { expect };
