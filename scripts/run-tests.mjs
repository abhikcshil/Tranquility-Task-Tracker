import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const testFiles = readdirSync('lib')
  .filter((file) => file.endsWith('.test.ts'))
  .sort()
  .map((file) => join('lib', file));

for (const testFile of testFiles) {
  const result = spawnSync(process.execPath, ['--import', 'tsx', testFile], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
