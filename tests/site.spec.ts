import { expect, test } from '@playwright/test';

test('SPA navigation, search, charts and history', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Turning Raw Data');
  await page.waitForFunction(() => document.querySelector('astro-island:not([ssr])'));
  await page.evaluate(() => { (window as Window & { spaMarker?: string }).spaMarker = 'alive'; });
  await page.getByRole('link', { name: 'View archive' }).click();
  await expect(page).toHaveURL('/blog/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Engineering Logs');
  expect(await page.evaluate(() => (window as Window & { spaMarker?: string }).spaMarker)).toBe('alive');
  const search = page.getByRole('searchbox', { name: 'Search logs' });
  await search.fill('no matching article');
  await expect(page.getByText('No articles match your search.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('button', { name: 'Automation', exact: true }).click();
  await expect(page.locator('blog-explorer').getByRole('status')).toHaveText('1 article');
  await search.fill('dotfiles');
  await page.getByRole('link', { name: 'The Modern Developer Setup: Mac, Windows, Ubuntu', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/posts\/dotfiles_automate.html\/?$/);
  await expect(page.locator('canvas')).toHaveCount(3);
  await expect.poll(() => page.locator('canvas').evaluateAll(items => items.every(item => Number(item.getAttribute('width')) > 0 && item.getAttribute('style')?.includes('display: block')))).toBe(true);
  await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))));
  await page.getByRole('link', { name: 'All engineering logs' }).click();
  await expect(page).toHaveURL('/blog/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Engineering Logs');
  await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))));
  await page.goBack();
  await expect(page).toHaveURL(/\/blog\/posts\/dotfiles_automate.html\/?$/);
  await expect(page.locator('canvas')).toHaveCount(3);
  await expect.poll(() => page.locator('canvas').first().getAttribute('style')).toContain('display: block');
  await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))));
  await page.reload();
  await expect(page.locator('canvas').first()).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
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
  await page.goto('http://127.0.0.1:4321/blog/');
  await expect(page.getByRole('link', { name: 'The Modern Developer Setup: Mac, Windows, Ubuntu', exact: true })).toBeVisible();
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
