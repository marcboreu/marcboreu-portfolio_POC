import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const runtimeFile = process.argv[2];
const pageFile = process.argv[3];

if (!runtimeFile || !pageFile) {
    throw new Error(
        'Uso: node scripts/prerender-runtime.mjs <runtime-file> <page-file>',
    );
}

const runtimeUrl = pathToFileURL(path.resolve(root, runtimeFile)).href;
const { renderPage } = await import(runtimeUrl);
const payload = JSON.parse(await readFile(path.resolve(root, pageFile), 'utf8'));

if (!payload.page || typeof payload.page !== 'object') {
    throw new Error(`Page object inválido en ${pageFile}`);
}

const rendered = await renderPage(payload.page);
const body = typeof rendered === 'string' ? rendered : rendered.body;

if (!body || body === '[object Object]' || !body.trim()) {
    throw new Error(`Render HTML inválido en ${pageFile}`);
}

process.stdout.write(JSON.stringify({
    head: typeof rendered === 'string' ? [] : rendered.head,
    body,
}));
