/*
 Shows Playwright HTML report if available; otherwise generates Cucumber HTML report
 from reports/cucumber-report.json and opens it.
*/
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');
const pwReportDir = resolve(root, 'playwright-report');
const cucumberJsonDir = resolve(root, 'reports');
const cucumberHtmlDir = resolve(root, 'reports', 'html');

function hasPlaywrightReport(): boolean {
  return existsSync(pwReportDir);
}

const forceCucumber = process.argv.includes('--cucumber');

try {
  if (!forceCucumber && hasPlaywrightReport()) {
    const indexFile = resolve(pwReportDir, 'index.html');
    console.log('Playwright report found. Opening static HTML (non-blocking)...');
    execSync(`open "${indexFile}"`);
    process.exit(0);
  }

  const jsonPath = resolve(cucumberJsonDir, 'cucumber-report.json');
  if (!existsSync(jsonPath)) {
    console.error(`No report found at "${jsonPath}". Run tests first (npm test).`);
    process.exit(1);
  }

  // Ensure output dir exists
  mkdirSync(cucumberHtmlDir, { recursive: true });

  // Generate Cucumber HTML report
  console.log('Generating Cucumber HTML report from reports/cucumber-report.json...');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const reporter = require('multiple-cucumber-html-reporter');
  reporter.generate({
    jsonDir: cucumberJsonDir,
    reportPath: cucumberHtmlDir,
    displayDuration: true,
    pageTitle: 'BrightLeaf E2E Report',
    reportName: 'BrightLeaf E2E (Cucumber)',
    metadata: {
      browser: { name: 'chromium', version: 'Playwright' },
      device: 'Local machine',
      platform: { name: process.platform, version: process.version }
    },
    customData: {
      title: 'Run info',
      data: [
        { label: 'Generated', value: new Date().toLocaleString() },
        { label: 'BASE_URL', value: process.env.BASE_URL || 'http://localhost:8080' },
        { label: 'API_URL', value: process.env.API_URL || 'http://localhost:3000/api' },
      ]
    }
  });

  const indexFile = resolve(cucumberHtmlDir, 'index.html');
  console.log(`Opening report: ${indexFile}`);
  // macOS: open the file in the default browser
  execSync(`open "${indexFile}"`);
} catch (e: any) {
  console.error(e?.message || e);
  process.exit(1);
}
