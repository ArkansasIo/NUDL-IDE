import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NUDL_ALGORITHM_CATALOG, NUDL_ALGORITHM_FILES } from '../src/nudl/algorithmCatalog';


describe('NUDL algorithm library', () => {
  it('contains exactly 200 algorithms', () => {
    assert.equal(NUDL_ALGORITHM_CATALOG.length, 200);
    assert.equal(NUDL_ALGORITHM_FILES.length, 200);
  });

  it('contains unique algorithm identifiers and file paths', () => {
    assert.equal(new Set(NUDL_ALGORITHM_CATALOG.map((x) => x.id)).size, 200);
    assert.equal(new Set(NUDL_ALGORITHM_FILES.map((x) => x.name)).size, 200);
  });

  it('generates valid NDF-looking source fixtures', () => {
    for (const example of NUDL_ALGORITHM_CATALOG) {
      assert.ok(example.source.includes(`fn ${example.id}`));
      assert.ok(example.description.length > 0);
    }
  });
});
