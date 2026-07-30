import * as migration_20260730_073910_baseline from './20260730_073910_baseline';

export const migrations = [
  {
    up: migration_20260730_073910_baseline.up,
    down: migration_20260730_073910_baseline.down,
    name: '20260730_073910_baseline'
  },
];
