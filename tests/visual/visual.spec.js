/**
 * Visual regression (NX-1): deterministic screenshot capture + comparison.
 *
 * Stability rules (see docs/testing/VISUAL_REGRESSION.md):
 * - Remote Unsplash images are ABORTED so baselines never depend on the
 *   network; the branded placeholder renders instead (deterministic).
 * - Animations disabled via Playwright snapshots config + reduced-motion
 *   context; year text masked (changes every January); webfont settling wait.
 * - Baselines live under tests/visual/__snapshots__/ (Playwright default).
 * - Never run with --update-snapshots after a failure without investigating
 *   first; update only after a reviewed design change.
 * Local dev only.
 */
import { test, expect } from '@playwright/test';

const SHOTS = [
  { name: 'home-desktop', route: '/index.html', viewport: { width: 1365, height: 900 } },
  { name: 'home-mobile', route: '/index.html', viewport: { width: 375, height: 812 } },
  { name: 'services', route: '/services.html', viewport: { width: 1365, height: 900 } },
  { name: 'tiles-marble', route: '/tiles-marble.html', viewport: { width: 1365, height: 900 } },
  { name: 'plumbing', route: '/plumbing.html', viewport: { width: 1365, height: 900 } },
  { name: 'electrical', route: '/electrical.html', viewport: { width: 1365, height: 900 } },
  { name: 'contact', route: '/contact.html', viewport: { width: 1365, height: 900 } },
];

test.describe('visual baselines', () => {
  for (const shot of SHOTS) {
    test(`${shot.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: shot.viewport,
        reducedMotion: 'reduce',
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      // Abort remote images/fonts so screenshots are deterministic offline.
      await page.route(/images\.unsplash\.com|fonts\.(googleapis|gstatic)\.com/, (route) =>
        route.abort()
      );
      // Lock to night theme baseline to match visual snapshots regardless of time of day
      await page.addInitScript(() => {
        sessionStorage.setItem('gv-theme-mode', 'dark');
      });
      await page.goto(shot.route);
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(700);
      await expect(page).toHaveScreenshot(`${shot.name}.png`, {
        fullPage: true,
        mask: [page.locator('[data-current-year]'), page.locator('#theme-toggle')],
        maskColor: '#d6aa49',
      });
      await context.close();
    });
  }
});
