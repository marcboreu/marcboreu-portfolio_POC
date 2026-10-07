import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const file = process.argv[2];

if (!file) {
    throw new Error('Falta el archivo page object');
}

const moduleUrl = pathToFileURL(path.resolve(root, file)).href;
const { renderPage } = await import(moduleUrl);
const page = JSON.parse(await readFile(process.argv[3], 'utf8'));

process.stdout.write(await renderPage(page));
