import { expect, test } from '@playwright/test';

test('English and Spanish homepages expose the free assessment', async ({ page }) => {
  await page.goto('/en');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Know where AI can make a measurable difference.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Take the free AI check' })).toBeVisible();

  await page.goto('/es');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Descubra dónde la IA puede marcar una diferencia medible.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Hacer el chequeo gratuito' })).toBeVisible();
});

test('11-question assessment calculates a deterministic result in preview mode', async ({
  page,
}) => {
  await page.goto('/en/assessment');

  const singleChoices = ['Professional services', 'Just me', '0–10'];
  for (const choice of singleChoices) {
    await page.getByText(choice, { exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
  }

  for (const choice of ['Phone calls', 'Email', 'Website form']) {
    await page.getByText(choice, { exact: true }).click();
  }
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByText('The next day or later', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('No consistent system', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  for (const choice of ['Lead intake', 'Scheduling', 'Data entry', 'Reporting']) {
    await page.getByText(choice, { exact: true }).click();
  }
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByText('No defined follow-up process', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('Limited visibility or reporting', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('Other', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('I want to start now', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByLabel('Your name').fill('Synthetic Test Person');
  await page.getByLabel('Business name').fill('Synthetic Test Business');
  await page.getByLabel('Work email').fill('synthetic@example.invalid');
  await page.getByRole('button', { name: 'Calculate my score' }).click();

  await expect(page).toHaveURL(/\/en\/assessment\/result$/u);
  await expect(page.getByLabel('100 out of 100')).toBeVisible();
  await expect(page.getByText('Included in the full Business Assessment')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get the full assessment — $299' })).toBeVisible();
  await expect(page.locator('.opportunity-card')).toHaveCount(3);
});

test('health endpoint exposes neither environment names nor values', async ({ request }) => {
  const response = await request.get('/api/health');
  const body = (await response.json()) as { status: string; service: string };

  expect(response.status()).toBe(200);
  expect(body).toEqual({ status: 'ok', service: 'bizmetria-web' });
  expect(JSON.stringify(body)).not.toContain('SUPABASE_SECRET_KEY');
});

test('sandbox authentication surface remains available', async ({ page }) => {
  await page.goto('/en/auth');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Access your assessment' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
