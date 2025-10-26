import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async assertLoaded() {
    await this.page.waitForURL(/dashboard\.html/);
    await expect(this.page.getByRole('heading', { name: /task dashboard|dashboard/i })).toBeVisible({ timeout: 5000 }).catch(async () => {
      // fallback to table presence
      await expect(this.page.locator('table')).toBeVisible();
    });
  }

  async logout() {
    await this.page.getByRole('button', { name: /logout/i }).click();
  }

  async createTask(title: string, description: string) {
    // Ensure form is ready and fill visible fields only
    await this.page.locator('#title').waitFor({ state: 'visible' });
    await this.page.locator('#title').fill(title);
    await this.page.locator('#description').fill(description);
    await this.page.getByRole('button', { name: /save/i }).click();
  }

  rowByTitle(title: string) {
    return this.page.locator('tbody tr').filter({ has: this.page.getByText(title, { exact: true }) });
  }

  async assertTaskRow(title: string, description: string, completedText: 'Yes'|'No') {
    const row = this.rowByTitle(title);
    await expect(row).toHaveCount(1);
    await expect(row.locator('td').nth(1)).toHaveText(description);
    await expect(row.locator('td').nth(2)).toContainText(completedText);
  }

  async editTask(oldTitle: string, newTitle: string, newDesc: string, completed: boolean) {
    const row = this.rowByTitle(oldTitle);
    await row.getByRole('button', { name: /edit/i }).click();
    await this.page.locator('#title').fill(newTitle);
    await this.page.locator('#description').fill(newDesc);
    const checkbox = this.page.locator('#completed');
    const isChecked = await checkbox.isChecked();
    if (completed !== isChecked) await checkbox.click();
    await this.page.getByRole('button', { name: /save/i }).click();
  }

  async toggleCompletion(title: string, completed: boolean) {
    const row = this.rowByTitle(title);
    await row.getByRole('button', { name: /edit/i }).click();
    const checkbox = this.page.locator('#completed');
    const isChecked = await checkbox.isChecked();
    if (completed !== isChecked) await checkbox.click();
    await this.page.getByRole('button', { name: /save/i }).click();
  }

  async deleteTask(title: string) {
    const row = this.rowByTitle(title);
    // Accept native dialog if it appears; otherwise continue
    const onDialog = (d: any) => d.accept();
    this.page.once('dialog', onDialog);
    await row.getByRole('button', { name: /delete/i }).click();
    await this.page.waitForTimeout(200);
  }

  async tryDeleteTask(title: string, accept: boolean) {
    const row = this.rowByTitle(title);
    const handler = (d: any) => (accept ? d.accept() : d.dismiss());
    this.page.once('dialog', handler);
    await row.getByRole('button', { name: /delete/i }).click();
    await this.page.waitForTimeout(200);
  }
}
