/**
 * Contact & WhatsApp enquiry E2E (NX-1).
 * The WhatsApp hand-off (window.open) is STUBBED — no real message is sent.
 * All submitted data is clearly synthetic fixture text. Local dev only.
 */
import { test, expect } from '@playwright/test';

const FIXTURE = {
  name: 'Test Visitor Alpha',
  phone: '+971500000001',
  location: 'Al Reem Island, Abu Dhabi',
  service: 'Plumbing & pipe fitting',
  message: 'Two bathrooms need new fittings & pipework — please advise.',
};

test.describe('contact links use approved values', () => {
  test('tel / mailto / wa.me present and correct', async ({ page }) => {
    await page.goto('/contact.html');
    const tel = page.locator('a[href="tel:+971581645299"]').first();
    await expect(tel).toBeVisible();

    const mail = page.locator('a[href="mailto:grandviewceramic202@gmail.com"]').first();
    await expect(mail).toBeAttached();

    const wa = page.locator('a[href^="https://wa.me/971581645299"]');
    expect(await wa.count(), 'at least one wa.me link').toBeGreaterThan(0);
    for (const href of await wa.evaluateAll((els) => els.map((e) => e.getAttribute('href')))) {
      expect(href).toBe('https://wa.me/971581645299');
    }
  });

  test('form does not claim email/database delivery', async ({ page }) => {
    await page.goto('/contact.html');
    const text = (await page.locator('#enquiry-form').innerText()).toLowerCase();
    expect(text).toContain('does not store');
    expect(text).toContain('whatsapp');
    expect(text).not.toContain('we will email');
    expect(text).not.toContain('saved to our database');
  });
});

test.describe('form validation', () => {
  test('empty submit is blocked with friendly feedback', async ({ page }) => {
    await page.goto('/contact.html');
    await page.locator('#enquiry-form button[type="submit"]').click();
    const status = page.locator('#form-status');
    await expect(status).toContainText(/required fields/i);
    await expect(status).toHaveClass(/is-error/);
  });

  test('invalid email shows understandable feedback', async ({ page }) => {
    await page.goto('/contact.html');
    await page.locator('#name').fill(FIXTURE.name);
    await page.locator('#phone').fill(FIXTURE.phone);
    await page.locator('#location').fill(FIXTURE.location);
    await page.locator('#email').fill('not-an-email');
    await page.locator('#service').selectOption(FIXTURE.service);
    await page.locator('#message').fill('Short fixture note.');
    await page.locator('#enquiry-form button[type="submit"]').click();
    const emailValid = await page.locator('#email').evaluate((el) => el.validity.valid);
    expect(emailValid, 'bad email must be invalid').toBe(false);
  });
});

test.describe('WhatsApp message hand-off (stubbed window.open)', () => {
  async function submitAndCaptureUrl(page, data) {
    await page.goto('/contact.html');
    // Stub window.open BEFORE submit so no real tab/message leaves the browser.
    await page.evaluate(() => {
      window.__gvOpened = [];
      window.open = (url) => {
        window.__gvOpened.push(url);
        return null;
      };
    });
    await page.locator('#name').fill(data.name);
    await page.locator('#phone').fill(data.phone);
    await page.locator('#location').fill(data.location);
    if (data.email) await page.locator('#email').fill(data.email);
    await page.locator('#service').selectOption(data.service);
    await page.locator('#message').fill(data.message);
    await page.locator('#enquiry-form button[type="submit"]').click();
    await page.waitForFunction(() => window.__gvOpened && window.__gvOpened.length > 0);
    return page.evaluate(() => window.__gvOpened[0]);
  }

  function decodedText(url) {
    const u = new URL(url);
    return decodeURIComponent(u.searchParams.get('text'));
  }

  test('valid submit prepares wa.me draft with all fields', async ({ page }) => {
    const url = await submitAndCaptureUrl(page, FIXTURE);
    expect(url.startsWith('https://wa.me/971581645299?text=')).toBe(true);
    const text = decodedText(url);
    for (const value of [FIXTURE.name, FIXTURE.phone, FIXTURE.location, FIXTURE.service, FIXTURE.message]) {
      expect(text).toContain(value);
    }
    await expect(page.locator('#form-status')).toContainText(/review/i);
  });

  test('encoding: ampersand, spaces, unicode, newlines are safe', async ({ page }) => {
    const tricky = {
      ...FIXTURE,
      name: 'Tést Vîsitor & Co — مرحبا',
      message: 'Line one & line two\nLine three with  spaces',
    };
    const url = await submitAndCaptureUrl(page, tricky);
    const query = url.split('?text=')[1];
    expect(query).not.toContain(' ');
    expect(query).toContain('%0A');
    expect(query).toContain('%26');
    const text = decodedText(url);
    expect(text).toContain(tricky.name);
    expect(text).toContain('Line one & line two\nLine three');
  });
});
