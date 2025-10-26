// tests/support/hooks.ts
import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, request, Browser } from 'playwright';
import { expect } from '@playwright/test';
import type { APIRequestContext, BrowserContext, Page } from 'playwright';
import { BrightWorld } from './world';

setDefaultTimeout(60 * 1000);

let sharedBrowser: Browser | undefined;

BeforeAll(async () => {
  sharedBrowser = undefined;
});

AfterAll(async () => {
  await sharedBrowser?.close();
});

Before(async function (this: BrightWorld) {
  // ---- Browser for UI ----
  const headlessParam = this.params.headless;
  const envHeadless = process.env.HEADLESS;
  const headless = typeof headlessParam === 'boolean'
    ? headlessParam
    : envHeadless
      ? envHeadless.toLowerCase() !== 'false'
      : true;
  if (!sharedBrowser) sharedBrowser = await chromium.launch({ headless });
  const baseUrl = this.params.baseUrl || process.env.BASE_URL || 'http://localhost:8080';
  this.browser = sharedBrowser;
  this.context = await this.browser.newContext({ baseURL: baseUrl });
  this.page = await this.context.newPage();

  // ---- API setup (normalize host + explicit /api paths) ----
  const rawApi = this.params.apiUrl || process.env.API_URL || 'http://localhost:3000/api';
  const apiHost = rawApi.replace(/\/api\/?$/, '');       // http://localhost:3000
  const apiBase = `${apiHost}/api/`;                      // http://localhost:3000/api/

  // unauthenticated context to do health + login
  const unauth = await request.newContext({ baseURL: apiHost });

  // health check
  const health = await unauth.get('/api/health');
  expect(health.ok(), `API not reachable at ${apiBase}/health (status ${health.status()})\n${await health.text()}`).toBeTruthy();

  // login via API
  const loginRes = await unauth.post('/api/login', {
    data: { username: 'admin', password: '123456' }
  });
  expect(loginRes.ok(), `Login failed (status ${loginRes.status()}): ${await loginRes.text()}`).toBeTruthy();

  const { token } = await loginRes.json();
  this.token = token;

  // authenticated API client for data setup/teardown
  this.request = await request.newContext({
    baseURL: apiBase,
    extraHTTPHeaders: { Authorization: `Bearer ${token}` }
  });

  await unauth.dispose();
});

After(async function (this: BrightWorld) {
  // Guarded cleanup so failures in Before don't cause crashes
  try { await this.page?.close(); } catch {}
  try { await this.context?.close(); } catch {}
  try { await this.request?.dispose(); } catch {}
});