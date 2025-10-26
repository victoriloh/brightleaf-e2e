import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const composePath = resolve(__dirname, '..', '..', 'qa-evaluation-app', 'qa-evaluation-app', 'docker-compose.yml');

try {
  if (!existsSync(composePath)) {
    console.error(`Docker compose file not found at: ${composePath}`);
    console.error('Ensure the app repo exists at ../qa-evaluation-app/qa-evaluation-app or update the path.');
    process.exit(1);
  }

  execSync(`docker compose -f ${composePath} up -d --build`, { stdio: 'inherit' });
  execSync('docker build -t brightleaf-e2e .', { stdio: 'inherit' });
  execSync('docker run --rm --network host brightleaf-e2e', { stdio: 'inherit' });
} catch {
  process.exit(1);
} finally {
  try { execSync(`docker compose -f ${composePath} down`, { stdio: 'inherit' }); } catch {}
}
