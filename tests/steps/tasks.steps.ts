import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BrightWorld } from '../support/world';
import { DashboardPage } from '../pages/DashboardPage';

Given('the task list is cleared via API', async function (this: BrightWorld) {
  const getWithRetry = async (attempts = 3): Promise<any[]> => {
    let lastErr: any;
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await this.request.get('tasks');
        if (res.ok()) return await res.json();
        lastErr = new Error(`GET /tasks failed ${res.status()}`);
      } catch (e) {
        lastErr = e;
      }
      await new Promise(r => setTimeout(r, 200 * (i + 1)));
    }
    throw lastErr;
  };

  const tasks = await getWithRetry();
  for (const t of tasks) {
    try {
      let del = await this.request.delete(`tasks/${t.id}`);
      if (!del.ok()) {
        await new Promise(r => setTimeout(r, 200));
        del = await this.request.delete(`tasks/${t.id}`);
      }
    } catch {}
  }
});

When('I create a task with title {string} and description {string}', async function (this: BrightWorld, title: string, desc: string) {
  const dash = new DashboardPage(this.page);
  await dash.createTask(title, desc);
});

Then('I should see a task titled {string} with description {string} and completed {string}', async function (this: BrightWorld, title: string, desc: string, completed: string) {
  const dash = new DashboardPage(this.page);
  await dash.assertTaskRow(title, desc, completed as any);
});

Then('no new task should be created', async function (this: BrightWorld) {
  // Validate against API to avoid UI empty-state placeholders
  const res = await this.request.get('tasks');
  expect(res.ok()).toBeTruthy();
  const tasks = await res.json();
  expect(tasks.length).toBe(0);
});

Given('a task exists with title {string} and description {string}', async function (this: BrightWorld, title: string, desc: string) {
  const res = await this.request.post('tasks', {
    data: { title, description: desc, completed: false }
  });
  expect(res.ok()).toBeTruthy();
  await this.page.reload(); 
});

When('I edit that task to title {string} description {string} completed {string}', async function (this: BrightWorld, title: string, desc: string, completed: string) {
  const dash = new DashboardPage(this.page);
  await dash.editTask('Old title', title, desc, completed.toLowerCase().startsWith('y'));
});

When('I delete the task titled {string}', async function (this: BrightWorld, title: string) {
  const dash = new DashboardPage(this.page);
  await dash.deleteTask(title);
});

Then('I should not see a task titled {string}', async function (this: BrightWorld, title: string) {
  await expect(this.page.locator('tbody tr', { hasText: title })).toHaveCount(0);
});

When('I mark the task {string} as completed', async function (this: BrightWorld, title: string) {
  const dash = new DashboardPage(this.page);
  await dash.toggleCompletion(title, true);
});

When('I attempt to delete the task titled {string} but cancel', async function (this: BrightWorld, title: string) {
  const dash = new DashboardPage(this.page);
  await dash.tryDeleteTask(title, false);
});

Then('I should still see a task titled {string}', async function (this: BrightWorld, title: string) {
  await expect(this.page.locator('tbody tr', { hasText: title })).toHaveCount(1);
});

When('I mark the task {string} as not completed', async function (this: BrightWorld, title: string) {
  const dash = new DashboardPage(this.page);
  await dash.toggleCompletion(title, false);
});
