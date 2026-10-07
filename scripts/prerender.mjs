import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = path.join(root, 'bootstrap/prerender/pages');
const outDir = path.join(root, 'bootstrap/prerender/html');
const runtimeFile = path.join(root, 'bootstrap/prerender-runtime/prerender.js');

await mkdir(outDir, { recursive: true });

let count = 0;

for (const file of await readdir(pagesDir)) {
    if (!file.endsWith('.json')) continue;

    const input = path.join(pagesDir, file);
    const payload = JSON.parse(await readFile(input, 'utf8'));
    const { stdout } = await execFileAsync(process.execPath, [
        path.join(root, 'scripts/prerender-runtime.mjs'),
        runtimeFile,
        input,
    ], { cwd: root, maxBuffer: 10 * 1024 * 1024 });

    const body = stdout.trim();

    if (!body) {
        throw new Error(`Render vacío para ${payload.path}`);
    }

    await writeFile(path.join(outDir, file), JSON.stringify({
        path: payload.path,
        version: payload.page.version ?? '',
        head: [],
        body,
    }, null, 2));

    console.log(`OK ${payload.path}`);
    count++;
}

console.log(`${count} páginas prerenderizadas`);
