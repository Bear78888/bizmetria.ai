import { expect, test } from '@playwright/test';

test('English and Spanish homepages expose the free assessment', async ({ page }) => {
  await page.goto('/en');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Measure where AI would actually pay off in your business.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get my free score' }).first()).toBeVisible();

  await page.goto('/es');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Mida dónde la IA realmente rendiría en su negocio.',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Obtener mi puntuación gratis' }).first(),
  ).toBeVisible();
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
  // Soft gate: a signed-out visitor sees the score but the area breakdown is
  // masked behind the create-account invitation.
  await expect(page.locator('.opportunity-card-locked')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Create my free account' })).toBeVisible();
});

test('health endpoint reports adapters without environment names or values', async ({
  request,
}) => {
  const response = await request.get('/api/health');
  const body = (await response.json()) as {
    status: string;
    service: string;
    revision: string;
    adapters: {
      assessmentStorage: string;
      analysisProvider: string;
      resultEmail: string;
      checkout: string;
    };
  };

  expect(response.status()).toBe(200);
  // Exact shape: an added field must be a deliberate choice, since everything
  // here is served publicly.
  expect(body).toEqual({
    status: 'ok',
    service: 'bizmetria-web',
    revision: expect.any(String),
    adapters: {
      assessmentStorage: 'mock',
      analysisProvider: 'deterministic',
      resultEmail: 'skipped',
      checkout: 'disabled',
    },
  });

  const serialised = JSON.stringify(body);
  for (const name of [
    'SUPABASE_SECRET_KEY',
    'SUPABASE_PROJECT_REF',
    'ANTHROPIC_API_KEY',
    'supabase.co',
    'sk-ant-',
    'sb_secret_',
  ]) {
    expect(serialised).not.toContain(name);
  }
});

test('authentication surface offers sign-in and registration', async ({ page }) => {
  await page.goto('/en/auth');
  await expect(page.getByRole('heading', { level: 1, name: 'Sign in to BizMetria' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  await page.getByRole('link', { name: 'Create a free account' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Create your free account' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('the header keeps try-free and sign-in reachable on phone-sized screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('button', { name: 'Try free' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Sign in' })).toBeVisible();
});

test('the try-free button opens the registration dialog with a sign-in switch', async ({
  page,
}) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'Try free' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Try BizMetria for free' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Create free account' })).toBeVisible();

  await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(dialog.getByRole('heading', { name: 'Sign in to BizMetria' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
