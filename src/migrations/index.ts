import * as migration_20260730_073910_baseline from './20260730_073910_baseline';
import * as migration_20260731_074350_uploadthing_key from './20260731_074350_uploadthing_key';

export const migrations = [
  {
    up: migration_20260730_073910_baseline.up,
    down: migration_20260730_073910_baseline.down,
    name: '20260730_073910_baseline',
  },
  {
    up: migration_20260731_074350_uploadthing_key.up,
    down: migration_20260731_074350_uploadthing_key.down,
    name: '20260731_074350_uploadthing_key'
  },
];
