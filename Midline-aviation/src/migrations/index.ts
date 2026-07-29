import * as migration_20260729_085857_initial from './20260729_085857_initial';
import * as migration_20260729_094717_home_page from './20260729_094717_home_page';

export const migrations = [
  {
    up: migration_20260729_085857_initial.up,
    down: migration_20260729_085857_initial.down,
    name: '20260729_085857_initial',
  },
  {
    up: migration_20260729_094717_home_page.up,
    down: migration_20260729_094717_home_page.down,
    name: '20260729_094717_home_page'
  },
];
