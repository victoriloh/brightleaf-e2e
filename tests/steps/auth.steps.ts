import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BrightWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

Given('the test API is reachable', async function (this: BrightWorld) {
  const res = await this.request.get('health').catch(()=>null);
  if (!res || !res.ok()) {
    throw new Error(`API not reachable at ${this.params.apiUrl}`);
  }
});

When('I log in with username {string} and password {string}', async function (this: BrightWorld, u: string, p: string) {
  const login = new LoginPage(this.page);
  await login.goto();
  await login.fill(u, p);
  await login.submit();
});

When('I attempt login with username {string} and password {string}', async function (this: BrightWorld, u: string, p: string) {
  const login = new LoginPage(this.page);
  await login.goto();
  await login.fill(u, p);
  await login.submit();
});

Then('I should be redirected to the dashboard', async function (this: BrightWorld) {
  const dash = new DashboardPage(this.page);
  await dash.assertLoaded();
});

Then('I should see the task list', async function (this: BrightWorld) {
  await expect(this.page.locator('table')).toBeVisible();
});

Then('I should see a login error message', async function (this: BrightWorld) {
  await expect(this.page.locator('#error')).toBeVisible();
});

Given('I am logged in', async function (this: BrightWorld) {
  const login = new LoginPage(this.page);
  await login.goto();
  await login.fill('admin', '123456');
  await login.submit();
  const dash = new DashboardPage(this.page);
  await dash.assertLoaded();
});

When('I log out', async function (this: BrightWorld) {
  const dash = new DashboardPage(this.page);
  await dash.logout();
});

Then('I should be on the login page', async function (this: BrightWorld) {
  await expect(this.page).toHaveURL(/login\.html/);
});

Given('I am not logged in', async function (this: BrightWorld) {
  await this.context.clearCookies();
  await this.page.addInitScript(() => {
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
  });
  await this.page.goto('/login.html');
});

When('I navigate to the dashboard', async function (this: BrightWorld) {
  await this.page.goto('/dashboard.html');
});

When('I refresh the page', async function (this: BrightWorld) {
  await this.page.reload();
});
