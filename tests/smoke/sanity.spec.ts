import { test, expect } from '@playwright/test';

// Minimal smoke to ensure app is reachable and Playwright HTML report is generated
// Relies on baseURL from playwright.config.ts (defaults to http://localhost:8080)

test.describe('Smoke', () => {
  test('login page loads and has fields', async ({ page, baseURL }) => {
    await page.goto('/login.html');
    // Basic checks: inputs and login button
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in|login/i })).toBeVisible();
  });
});
