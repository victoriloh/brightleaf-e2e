"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 Shows Playwright HTML report if available; otherwise generates Cucumber HTML report
 from reports/cucumber-report.json and opens it.
*/
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const root = (0, node_path_1.resolve)(__dirname, '..');
const pwReportDir = (0, node_path_1.resolve)(root, 'playwright-report');
const cucumberJsonDir = (0, node_path_1.resolve)(root, 'reports');
const cucumberHtmlDir = (0, node_path_1.resolve)(root, 'reports', 'html');
function hasPlaywrightReport() {
    return (0, node_fs_1.existsSync)(pwReportDir);
}
try {
    if (hasPlaywrightReport()) {
        console.log('Playwright report found. Opening with "playwright show-report"...');
        (0, node_child_process_1.execSync)('npx playwright show-report', { stdio: 'inherit' });
        process.exit(0);
    }
    const jsonPath = (0, node_path_1.resolve)(cucumberJsonDir, 'cucumber-report.json');
    if (!(0, node_fs_1.existsSync)(jsonPath)) {
        console.error(`No report found at "${jsonPath}". Run tests first (npm test).`);
        process.exit(1);
    }
    // Ensure output dir exists
    (0, node_fs_1.mkdirSync)(cucumberHtmlDir, { recursive: true });
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
    const indexFile = (0, node_path_1.resolve)(cucumberHtmlDir, 'index.html');
    console.log(`Opening report: ${indexFile}`);
    // macOS: open the file in the default browser
    (0, node_child_process_1.execSync)(`open "${indexFile}"`);
}
catch (e) {
    console.error(e?.message || e);
    process.exit(1);
}
