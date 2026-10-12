/**
 * Accessibility E2E (NX-1).
 * Native Playwright assertions (labels, alt, landmarks, contrast spot-check)
 * plus an axe-core scan (critical/serious only). An automated scan does NOT
 * prove full accessibility compliance — see docs/testing/PLAYWRIGHT_GUIDE.md.
 * Local dev only.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/index.html',
  '/about.html',
  '/services.html',
  '/tiles-marble.html',
  '/plumbing.html',
  '/electrical.html',
  '/projects.html',
  '/contact.html',
];

test.describe('labels, alt text, landmarks', () => {
  for (const route of PAGES) {
    test(`${route}: form labels, image alt, landmarks`, async ({ page }) => {
      await page.goto(route);
      const unlabeled = await page.evaluate(() => {
        const bad = [];
        for (const el of document.querySelectorAll('input, select, textarea')) {
          const id = el.id;
          const labelled =
            (id && document.querySelector(`label[for="${id}"]`)) ||
            el.getAttribute('aria-label') ||
            el.closest('label');
          if (!labelled) bad.push(el.outerHTML.slice(0, 80));
        }
        return bad;
      });
      expect(unlabeled, `${route} all controls labelled`).toEqual([]);

      const missingAlt = await page.evaluate(() =>
        [...document.querySelectorAll('img')]
          .filter((img) => img.getAttribute('alt') === null)
          .map((img) => img.getAttribute('src'))
      );
      expect(missingAlt, `${route} all images have alt`).toEqual([]);

      await expect(page.locator('main#main-content')).toBeVisible();
      await expect(page.locator('nav[aria-label]').first()).toBeAttached();
    });
  }
});

test.describe('axe-core scan (critical + serious)', () => {
  for (const route of PAGES) {
    test(`${route}: no critical/serious violations`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const blocking = results.violations.filter((v) =>
        ['critical', 'serious'].includes(v.impact)
      );
      const detail = blocking
        .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.help}`)
        .join('\n');
      expect(blocking, `${route} axe critical/serious:\n${detail}`).toEqual([]);
      // Moderate/minor violations are recorded, not failed, and reviewed
      // in the NX-1 test report.
      if (results.violations.length > 0) {
        console.log(
          `[axe ${route}] non-blocking: ` +
            results.violations.map((v) => `${v.id}/${v.impact}`).join(', ')
        );
      }
    });
  }
});
