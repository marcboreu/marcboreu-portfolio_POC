import { spawn } from 'node:child_process';
import process from 'node:process';

const child = spawn(process.execPath, ['scripts/prerender.mjs'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
        ...process.env,
        APP_ENV: 'local',
        APP_URL: process.env.APP_URL ?? 'http://localhost:8000',
    },
});

child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
});
