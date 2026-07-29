import * as migration_20260729_085857_initial from './20260729_085857_initial';

export const migrations = [
  {
    up: migration_20260729_085857_initial.up,
    down: migration_20260729_085857_initial.down,
    name: '20260729_085857_initial'
  },
];
