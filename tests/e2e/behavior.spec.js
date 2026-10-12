/**
 * Behaviour E2E: image fallback, reduced motion, reveal (NX-1).
 * Covers the site's own behaviour modules without touching production.
 * Local dev only.
 */
import { test, expect } from '@playwright/test';

test.describe('image fallback', () => {
  test('broken remote image swaps to branded placeholder', async ({ page }) => {
    await page.goto('/projects.html');
    await page.evaluate(() => {
      const img = document.querySelector('img');
      img.setAttribute('src', 'https://127.0.0.1:9/definitely-missing.jpg');
    });
    const first = page.locator('img').first();
    await expect(first).toHaveAttribute('src', /placeholder\.svg$/);
    await expect(first).toHaveClass(/is-fallback/);
  });
});

test.describe('reduced motion', () => {
  test('content stays visible and usable with prefers-reduced-motion', async ({ browser }) => {
    // Use mobile viewport so menu-toggle is rendered (it is CSS-hidden at desktop).
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    await page.goto('/index.html');
    await page.waitForTimeout(800);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.height > 5 && (s.opacity === '0' || s.visibility === 'hidden');
        })
        .map((el) => el.className)
    );
    expect(hidden, 'no content hidden under reduced motion').toEqual([]);
    await expect(page.locator('.menu-toggle, #main-navigation a').first()).toBeVisible();
    const formVisible = await page.goto('/contact.html').then(async () => {
      await expect(page.locator('#enquiry-form')).toBeVisible();
      return true;
    });
    expect(formVisible).toBe(true);
    await context.close();
  });
});

test.describe('scroll reveal (motion.js)', () => {
  test('sections gain .is-visible on scroll; no layout shift', async ({ page }) => {
    await page.goto('/services.html');
    const before = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(900);
    const revealed = await page.evaluate(
      () => document.querySelectorAll('[data-reveal].is-visible').length
    );
    expect(revealed, 'at least one section revealed').toBeGreaterThan(0);
    const after = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(Math.abs(after - before), 'no large layout shift').toBeLessThan(120);
  });
});

test.describe('adaptive theme (sunlight / moonlight)', () => {
  test('initializes with theme and data-theme-mode attributes', async ({ page }) => {
    await page.goto('/index.html');
    const htmlTheme = await page.locator('html').getAttribute('data-theme');
    const htmlMode = await page.locator('html').getAttribute('data-theme-mode');
    expect(['morning', 'day', 'evening', 'night']).toContain(htmlTheme);
    expect(htmlMode).toBe('auto');

    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('data-mode', 'auto');
  });

  test('clicking toggle button cycles through auto -> light -> dark -> auto', async ({ page }) => {
    await page.goto('/index.html');
    const toggle = page.locator('#theme-toggle');

    // Initial is auto
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'auto');

    // Click 1 -> light (locks to day)
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');

    // Click 2 -> dark (locks to night)
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');

    // Click 3 -> auto
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'auto');
  });

  test('theme preference persists across navigation via sessionStorage', async ({ page }) => {
    await page.goto('/index.html');
    const toggle = page.locator('#theme-toggle');
    await toggle.click(); // set to light
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');

    // Navigate to about page
    await page.locator('#main-navigation a[href="about.html"]').first().click();
    await expect(page).toHaveURL(/\/about\.html$/);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');
  });
});

test.describe('Arabic subpath and asset loading (ar/*.html)', () => {
  test('direct visit to /ar/index.html loads assets cleanly with dir=rtl', async ({ page }) => {
    const failedRequests = [];
    page.on('requestfailed', (req) => failedRequests.push(req.url()));

    const response = await page.goto('/ar/index.html');
    expect(response.status()).toBe(200);

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');

    // Check logo image loads successfully
    const logo = page.locator('.brand-logo').first();
    await expect(logo).toBeVisible();
    const naturalWidth = await logo.evaluate((el) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);

    // No failed asset network requests
    expect(failedRequests).toEqual([]);

    // Arabic navigation links resolve internally within /ar/
    await page.locator('#main-navigation a[href="about.html"]').click();
    await expect(page).toHaveURL(/\/ar\/about\.html$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});

