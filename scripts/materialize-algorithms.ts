import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { NUDL_ALGORITHM_FILES } from '../src/nudl/algorithmCatalog';

const root = join(process.cwd(), 'examples', 'algorithms');

for (const file of NUDL_ALGORITHM_FILES) {
  const destination = join(process.cwd(), 'examples', file.name);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, file.content, 'utf8');
}

console.log(`Materialized ${NUDL_ALGORITHM_FILES.length} NUDL .ndf algorithm files under examples/algorithms/.`);
