import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = path.join(root, 'bootstrap/prerender/pages');
const outDir = path.join(root, 'bootstrap/prerender/html');

const { render } = await import(pathToFileURL(path.join(root, 'bootstrap/ssr/ssr.js')).href);

await mkdir(outDir, { recursive: true });

let count = 0;

for (const file of await readdir(pagesDir)) {
    if (!file.endsWith('.json')) continue;

    const { path: url, page } = JSON.parse(await readFile(path.join(pagesDir, file), 'utf8'));
    const result = await render(page);

    await writeFile(
        path.join(outDir, file),
        JSON.stringify({ path: url, version: page.version ?? null, head: result.head, body: result.body }),
    );

    console.log(`OK ${url}`);
    count++;
}

console.log(`${count} paginas prerenderizadas`);
