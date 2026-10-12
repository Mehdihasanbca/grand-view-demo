/**
 * Playwright global setup — rebuild dist/ from config + templates before the
 * browser suite runs, so specs always test fresh generated output.
 * Dev-only. Never publishes anything.
 */
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export default async function globalSetup() {
  execFileSync(process.execPath, [join(root, 'tools', 'build.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
}
