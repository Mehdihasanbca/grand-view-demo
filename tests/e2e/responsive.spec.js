/**
 * Responsive & keyboard/skip-link E2E (NX-1).
 * Viewports match docs/design/RESPONSIVE_SYSTEM.md breakpoints.
 * Local dev only.
 */
import { test, expect } from '@playwright/test';

export const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'large-mobile', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1365, height: 900 },
  { name: 'large-desktop', width: 1920, height: 1080 },
];

test.describe('no horizontal overflow; images contained; type readable', () => {
  for (const vp of VIEWPORTS) {
    for (const route of ['/index.html', '/services.html', '/contact.html', '/projects.html']) {
      test(`${vp.name} ${route}: fits viewport`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);
        await expect(page.locator('h1')).toBeVisible();

        const overflow = await page.evaluate(() => {
          const de = document.documentElement;
          return {
            scrollW: de.scrollWidth,
            clientW: de.clientWidth,
            wideImages: [...document.querySelectorAll('img')]
              .filter((img) => img.getBoundingClientRect().width > window.innerWidth + 1)
              .map((img) => img.getAttribute('src')),
          };
        });
        expect(overflow.scrollW, `${vp.name} ${route} no horizontal overflow`).toBeLessThanOrEqual(
          overflow.clientW + 1
        );
        expect(overflow.wideImages, `${vp.name} ${route} images inside viewport`).toEqual([]);

        const h1Size = await page.locator('h1').evaluate((el) =>
          Number.parseFloat(getComputedStyle(el).fontSize)
        );
        expect(h1Size, `${vp.name} h1 readable`).toBeGreaterThanOrEqual(24);
      });
    }
  }
});

test.describe('mobile menu opens, navigates, closes', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger toggles, link navigates, Escape/outside close', async ({ page }) => {
    await page.goto('/index.html');
    const toggle = page.locator('.menu-toggle');
    const nav = page.locator('.main-nav');
    await expect(toggle).toBeVisible();
    await expect(nav).not.toHaveClass(/is-open/);

    // Open.
    await toggle.click();
    await expect(nav).toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Navigate via a link; menu closes.
    await nav.locator('a[href="about.html"]').click();
    await expect(page).toHaveURL(/\/about\.html$/);
    await expect(nav).not.toHaveClass(/is-open/);

    // Escape closes.
    await toggle.click();
    await expect(nav).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(nav).not.toHaveClass(/is-open/);
    await expect(toggle).toBeFocused();

    // Outside click closes — click at a fixed page coordinate below the open nav dropdown.
    await toggle.click();
    await expect(nav).toHaveClass(/is-open/);
    // Click at the bottom half of the viewport, well below the nav dropdown.
    await page.mouse.click(180, 600);
    await expect(nav).not.toHaveClass(/is-open/);
  });
});

test.describe('keyboard and skip navigation', () => {
  test('skip link jumps to main; focus ring visible on nav link', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link').first();
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();

    const firstLink = page.locator('#main-navigation a').first();
    await firstLink.focus();
    const outline = await firstLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return { width: s.outlineWidth, style: s.outlineStyle };
    });
    expect(outline.width === '0px' && outline.style === 'none', 'focus outline must be visible').toBe(false);
  });
});
