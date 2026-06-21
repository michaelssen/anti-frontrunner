import { spawn } from 'child_process';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'assets/og-image.png');
const port = 3456;
const url = `http://127.0.0.1:${port}/`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npx', ['--yes', 'serve', '.', '-p', String(port)], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    const onData = (chunk) => {
      output += chunk.toString();
      if (/Accepting connections|Serving!|http:/i.test(output)) resolve(server);
    };

    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    server.on('error', reject);

    setTimeout(() => {
      if (!server.killed) resolve(server);
    }, 5000);
  });
}

const server = await startServer();
await wait(500);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
});

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(750);
  await page.screenshot({
    path: outPath,
    type: 'png',
  });
  console.log(`Wrote ${outPath}`);
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
