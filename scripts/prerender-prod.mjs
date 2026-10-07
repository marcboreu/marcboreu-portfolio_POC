import { spawn } from 'node:child_process';
import process from 'node:process';

const appUrl = process.env.APP_URL?.trim().replace(/\/$/, '');

if (!appUrl || !appUrl.startsWith('https://')) {
    throw new Error(
        'prerender:prod requiere APP_URL HTTPS, por ejemplo APP_URL=https://marcboreu.com',
    );
}

const child = spawn(process.execPath, ['scripts/prerender.mjs'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
        ...process.env,
        APP_ENV: 'production',
        APP_URL: appUrl,
    },
});

child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
});
