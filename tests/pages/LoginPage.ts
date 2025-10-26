import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login.html');
  }

  async fill(username: string, password: string) {
    await this.page.getByLabel('Username', { exact: false }).fill(username);
    await this.page.getByLabel('Password', { exact: false }).fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: /log in|login/i }).click();
  }

  async assertError() {
    await expect(this.page.locator('#error')).toBeVisible();
  }

  async assertOnLogin() {
    await this.page.waitForURL(/login\.html/);
  }
}
