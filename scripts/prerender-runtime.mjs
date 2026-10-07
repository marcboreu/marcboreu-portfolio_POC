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

const payload = JSON.parse(
    await readFile(path.resolve(root, pageFile), 'utf8'),
);

if (!payload.page || typeof payload.page !== 'object') {
    throw new Error(`Page object inválido en ${pageFile}`);
}

const html = await renderPage(payload.page);

if (!html || !html.trim()) {
    throw new Error(`Render vacío en ${pageFile}`);
}

process.stdout.write(html);
