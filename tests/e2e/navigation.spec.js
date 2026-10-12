/**
 * Navigation & shared-chrome E2E (NX-1).
 * Covers: routes return 200, one H1 each, shared header/footer/nav/company
 * info present, internal links resolve, page-to-page navigation works.
 * Synthetic fixture data only. Local dev only.
 */
import { test, expect } from '@playwright/test';

const PAGES = [
  { route: '/index.html', name: 'home' },
  { route: '/about.html', name: 'about' },
  { route: '/services.html', name: 'services' },
  { route: '/tiles-marble.html', name: 'tiles-marble' },
  { route: '/plumbing.html', name: 'plumbing' },
  { route: '/electrical.html', name: 'electrical' },
  { route: '/projects.html', name: 'projects' },
  { route: '/contact.html', name: 'contact' },
];

test.describe('routes return successful responses', () => {
  for (const { route } of PAGES) {
    test(`GET ${route} -> 200`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status(), `${route} status`).toBe(200);
      expect(res.headers()['content-type'] || '').toContain('text/html');
    });
  }
});

test.describe('page structure and shared chrome', () => {
  for (const { route } of PAGES) {
    test(`${route}: title, one H1, header/footer/nav, company info`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(String(err)));
      await page.goto(route);
      await expect(page).toHaveTitle(/.+/);

      const h1Count = await page.locator('h1').count();
      expect(h1Count, `${route} must have exactly one h1`).toBe(1);

      await expect(page.locator('.skip-link').first()).toBeAttached();
      await expect(page.locator('.site-header').first()).toBeVisible();
      await expect(page.locator('#main-navigation').first()).toBeVisible();
      await expect(page.locator('.site-footer').first()).toBeVisible();

      // Company info present (approved values only).
      await expect(page.locator('a[href="tel:+971581645299"]').first()).toBeVisible();
      await expect(page.locator('a[href="mailto:grandviewceramic202@gmail.com"]').first()).toBeAttached();
      await expect(
        page.locator('a[href="https://wa.me/971581645299"]').first()
      ).toBeAttached();
      await expect(page.locator('main#main-content').first()).toBeVisible();

      // Internal navigation hrefs resolve to real pages.
      const hrefs = await page.locator('a[href]:not([href^="http"]):not([href^="tel:"]):not([href^="mailto:"])').evaluateAll(
        (anchors) => anchors.map((a) => a.getAttribute('href')).filter(Boolean)
      );
      for (const href of hrefs) {
        const clean = href.split('#')[0].split('?')[0];
        if (!clean) continue;
        const res = await page.request.get(clean.startsWith('/') ? clean : `/${clean}`);
        expect(res.status(), `${route} link ${href} resolves`).toBeLessThan(400);
      }

      expect(errors, `${route} must have no uncaught JS errors`).toEqual([]);
    });
  }
});

test.describe('page-to-page navigation', () => {
  test('header nav reaches every section and Request a quote opens contact', async ({ page }) => {
    await page.goto('/index.html');
    for (const target of ['/about.html', '/services.html', '/projects.html']) {
      await page.locator(`#main-navigation a[href="${target.slice(1)}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(target.replace('/', '\\/') + '$'));
    }
    await page.goto('/index.html');
    await page.locator('.nav-cta').first().click();
    await expect(page).toHaveURL(/\/contact\.html$/);
  });

  test('service cards link to their detail pages', async ({ page }) => {
    await page.goto('/services.html');
    for (const target of ['tiles-marble.html', 'plumbing.html', 'electrical.html']) {
      await expect(
        page.locator(`a[href="${target}"]`).first(),
        `services links to ${target}`
      ).toBeVisible();
    }
  });
});
