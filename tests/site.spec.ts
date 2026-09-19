import { expect, test } from '@playwright/test';

test('Homelab navigation, direct loading and removed blog routes', async ({ page, request, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.waitForFunction(() => document.querySelector('astro-island:not([ssr])'));
  await page.evaluate(() => { (window as Window & { spaMarker?: string }).spaMarker = 'alive'; });
  await expect(page.locator('a[href*="blog"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore the homelab', exact: true }).click();
  await expect(page).toHaveURL('/homelab/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homelab');
  if (isMobile) await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Homelab' })).toHaveAttribute('aria-current', 'page');
  if (isMobile) await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('link', { name: 'View project on GitHub' })).toHaveAttribute('href', 'https://github.com/mdyzma/homelab');
  expect(await page.evaluate(() => (window as Window & { spaMarker?: string }).spaMarker)).toBe('alive');
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-astro-transition'));
  await page.goBack();
  await expect(page).toHaveURL('/');
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-astro-transition'));
  await page.goForward();
  await expect(page).toHaveURL('/homelab/');
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-astro-transition'));
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homelab');
  expect((await request.get('/blog/')).status()).toBe(404);
  expect((await request.get('/blog/posts/dotfiles_automate.html')).status()).toBe(404);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('mobile navigation and reduced motion', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Actionable Insights');
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('navigation').getByRole('link', { name: 'Stack', exact: true }).click();
    await expect(page).toHaveURL('/#stack');
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('static content works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.getByRole('heading', { name: 'Core Competencies' })).toBeVisible();
  await page.goto('http://127.0.0.1:4321/homelab/');
  await expect(page.getByRole('heading', { name: 'Homelab', exact: true })).toBeVisible();
  await context.close();
});

test('contact is the only React island and supports failed delivery followed by retry', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  let calls = 0;
  const keys: string[] = [];
  await page.route('**/api/contact', async route => {
    calls++;
    keys.push(route.request().headers()['idempotency-key']);
    expect(route.request().postDataJSON()).toMatchObject({ name: 'Ada Lovelace', email: 'ada@example.com' });
    await route.fulfill({ status: calls === 1 ? 502 : 200, contentType: 'application/json', body: JSON.stringify(calls === 1 ? { error: 'Email delivery failed. Please retry.' } : { ok: true }) });
  });
  await page.goto('/');
  await expect(page.locator('astro-island')).toHaveCount(1);
  await expect(page.locator('astro-island')).toHaveAttribute('component-url', /ContactForm/);
  const form = page.getByRole('form', { name: 'Contact Michal' });
  await form.getByLabel('Name', { exact: true }).fill('Ada Lovelace');
  await form.getByLabel('Email', { exact: true }).fill('ada@example.com');
  await form.getByLabel('Message', { exact: true }).fill('I would like to discuss a data pipeline.');
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByRole('status')).toContainText('Email delivery failed');
  await expect(form.getByLabel('Message', { exact: true })).toHaveValue('I would like to discuss a data pipeline.');
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByRole('status')).toContainText('Your message has been sent');
  await expect(form.getByLabel('Message', { exact: true })).toHaveValue('');
  expect(keys[0]).toBe(keys[1]);
  expect(errors).toEqual([]);
});

test('status MVP filters demo services and shows an empty state', async ({ page }) => {
  await page.goto('/homelab/#service-status');
  const panel = page.locator('service-status');
  await expect(panel.getByText('Demo data · not connected to Uptime Kuma')).toBeVisible();
  await expect(panel.locator('tbody tr')).toHaveCount(15);
  await panel.getByRole('button', { name: 'AI', exact: true }).click();
  await expect(panel.locator('tbody tr')).toHaveCount(3);
  await panel.getByRole('button', { name: 'Monitoring', exact: true }).click();
  await expect(panel.locator('tbody tr')).toHaveCount(6);
  await panel.getByLabel('Status', { exact: true }).selectOption('down');
  await expect(panel.locator('[data-empty]')).toBeVisible();
  await panel.getByRole('button', { name: 'Reset filters' }).click();
  await panel.getByLabel('Find a service').fill('ollama');
  await expect(panel.locator('tbody tr')).toHaveCount(1);
  await expect(panel.locator('tbody')).toContainText('Ollama');
});

test('status MVP marks old snapshots stale and retains the fallback on errors', async ({ page }) => {
  await page.route('**/status.json', route => route.fulfill({ json: {version:1, demo:false, generatedAt:'2020-01-01T00:00:00Z', monitors:[{id:'1',name:'Test monitor',status:'unknown',responseMs:null,tags:['Test']}]}}));
  await page.goto('/homelab/#service-status');
  const panel = page.locator('service-status');
  await expect(panel.locator('[data-freshness]')).toContainText('Snapshot overdue');
  await expect(panel.locator('tbody tr')).toHaveCount(1);
  await expect(panel.locator('[data-demo-note]')).toBeHidden();
  await page.unroute('**/status.json');
  await page.route('**/status.json', route => route.fulfill({json:{broken:true}}));
  await page.reload();
  await expect(panel.getByRole('alert')).toContainText('Could not load');
  await expect(panel.locator('tbody tr')).toHaveCount(15);
  await expect(panel.locator('[data-freshness]')).toContainText('Demo data');
});
