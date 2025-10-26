"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const composePath = (0, node_path_1.resolve)(__dirname, '..', '..', 'qa-evaluation-app', 'qa-evaluation-app', 'docker-compose.yml');
try {
    if (!(0, node_fs_1.existsSync)(composePath)) {
        console.error(`Docker compose file not found at: ${composePath}`);
        console.error('Ensure the app repo exists at ../qa-evaluation-app/qa-evaluation-app or update the path.');
        process.exit(1);
    }
    (0, node_child_process_1.execSync)(`docker compose -f ${composePath} up -d --build`, { stdio: 'inherit' });
    (0, node_child_process_1.execSync)('docker build -t brightleaf-e2e .', { stdio: 'inherit' });
    (0, node_child_process_1.execSync)('docker run --rm --network host brightleaf-e2e', { stdio: 'inherit' });
}
catch {
    process.exit(1);
}
finally {
    try {
        (0, node_child_process_1.execSync)(`docker compose -f ${composePath} down`, { stdio: 'inherit' });
    }
    catch { }
}
