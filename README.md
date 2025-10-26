# BrightLeaf E2E (Playwright + Cucumber)

End-to-end, BDD-style tests for the QA Evaluation App (LeafTasks-like).

## What you get
- Playwright + Cucumber (Gherkin) setup
- Feature files covering auth and core task flows
- Page Objects for maintainability
- API-backed cleanup hooks to keep data clean
- Works **locally** and **in Docker**

## Project layout
```
tests/
  features/          # .feature files
  steps/             # step definitions
  pages/             # page objects
  support/           # hooks & world
Dockerfile           # run tests in a container
cucumber.yml         # runtime profiles
playwright.config.ts # test runner config (report, trace, video)
```

## Run locally

1. Start the app (from the app root):

```bash
cd /mnt/data/qa-evaluation-app/qa-evaluation-app
docker compose up -d --build
# Frontend: http://localhost:8080  Backend: http://localhost:3000
```

2. Install deps & run tests (in this folder):

```bash
cd /mnt/data/brightleaf-e2e
npm install
npm run prep
npm test
```

- Headed debugging:
```
npm run test:headed
```

- Open Playwright HTML report (after run):
```
npm run report
```

## Run tests in Docker

From this folder:

```bash
npm install
node scripts/run-in-docker.js
```

This will:
- Bring up the app stack via docker compose
- Build a Playwright image with tests
- Execute tests against `http://frontend:8080` / `http://backend:3000`

## Config

Adjust via env (create `.env` from `.env.example` if needed):

```
BASE_URL=http://localhost:8080
API_URL=http://localhost:3000/api
HEADLESS=true
```

## Scenarios covered

- Login (valid / invalid) and logout
- Create task (valid / validation error)
- Edit task (title, description, completed)
- Delete task
- Mark task as completed

## Best practices applied

- BDD with readable Gherkin feature files
- Page Object Model for UI operations
- API-assisted setup/teardown to keep tests fast & stable
- Explicit waits and robust locators
- Artifacts: trace/video/screenshots on failure

---

Made for BrightLeaf Technologies by your friendly Senior QA
