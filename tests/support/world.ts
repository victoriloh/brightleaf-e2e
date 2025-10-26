import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { chromium, Browser, Page, APIRequestContext, request, BrowserContext } from 'playwright';

interface Params {
  baseUrl: string;
  apiUrl: string;
  headless?: boolean;
}

export class BrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  request!: APIRequestContext;
  params: Params;
  token: string | null = null;

  constructor(options: IWorldOptions) {
    super(options);
    this.params = {
      baseUrl: (options.parameters as any)?.baseUrl || process.env.BASE_URL || 'http://localhost:8080',
      apiUrl: (options.parameters as any)?.apiUrl || process.env.API_URL || 'http://localhost:3000/api',
      headless: (options.parameters as any)?.headless ?? true
    };
  }
}

setWorldConstructor(BrightWorld);
