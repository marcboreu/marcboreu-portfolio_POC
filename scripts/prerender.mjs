import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
);

const pagesDir = path.join(root, 'bootstrap/prerender/pages');
const outDir = path.join(root, 'bootstrap/prerender/html');
const ssrFile = path.join(root, 'bootstrap/ssr/ssr.js');

const host = '127.0.0.1';
const port = 13714;
const baseUrl = `http://${host}:${port}`;

const server = spawn(process.execPath, [ssrFile], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
});

server.stdout.on('data', (data) => {
    process.stdout.write(`[ssr] ${data}`);
});

server.stderr.on('data', (data) => {
    process.stderr.write(`[ssr] ${data}`);
});

function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function waitForServer() {
    for (let attempt = 0; attempt < 100; attempt++) {
        try {
            const response = await fetch(`${baseUrl}/health`);

            if (response.ok) {
                return;
            }
        } catch {
            // El servidor aún está arrancando.
        }

        await sleep(100);
    }

    throw new Error(
        `El servidor SSR no ha arrancado en ${baseUrl}`,
    );
}

async function stopServer() {
    if (server.exitCode === null) {
        server.kill('SIGTERM');
        await sleep(100);
    }
}

try {
    await mkdir(outDir, { recursive: true });
    await waitForServer();

    let count = 0;

    for (const file of await readdir(pagesDir)) {
        if (!file.endsWith('.json')) {
            continue;
        }

        const payload = JSON.parse(
            await readFile(path.join(pagesDir, file), 'utf8'),
        );

        const response = await fetch(`${baseUrl}/render`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload.page),
        });

        if (!response.ok) {
            const message = await response.text();

            throw new Error(
                `SSR falló para ${payload.path}: HTTP ${response.status} ${message}`,
            );
        }

        const rendered = await response.json();

        const output = {
            path: payload.path,
            version: payload.page.version ?? '',
            head: rendered.head ?? '',
            body: rendered.body ?? '',
        };

        if (!output.body) {
            throw new Error(
                `SSR devolvió un body vacío para ${payload.path}`,
            );
        }

        await writeFile(
            path.join(outDir, file),
            JSON.stringify(output, null, 2),
        );

        console.log(`OK ${payload.path}`);
        count++;
    }

    console.log(`${count} páginas prerenderizadas`);
} finally {
    await stopServer();
}