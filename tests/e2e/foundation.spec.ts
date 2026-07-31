import { expect, test } from '@playwright/test';

test('English foundation page is accessible', async ({ page }) => {
  await page.goto('/en');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Find the clearest AI opportunities in your business.',
    }),
  ).toBeVisible();
  await expect(page.getByText('Sandbox build — no live payments')).toBeVisible();
});

test('Spanish foundation page is accessible', async ({ page }) => {
  await page.goto('/es');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Encuentra las oportunidades de IA más claras para tu negocio.',
    }),
  ).toBeVisible();
  await expect(page.getByText('Versión sandbox — sin pagos reales')).toBeVisible();
});

test('health endpoint exposes neither environment names nor values', async ({ request }) => {
  const response = await request.get('/api/health');
  const body = (await response.json()) as { status: string; service: string };

  expect(response.status()).toBe(200);
  expect(body).toEqual({ status: 'ok', service: 'bizmetria-web' });
  expect(JSON.stringify(body)).not.toContain('SUPABASE_SECRET_KEY');
});

test('sandbox authentication surface renders without mutating data', async ({ page }) => {
  await page.goto('/en/auth');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Access your assessment' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});
