import * as migration_20260729_085857_initial from './20260729_085857_initial';
import * as migration_20260729_094717_home_page from './20260729_094717_home_page';
import * as migration_20260729_100836_home_sections from './20260729_100836_home_sections';
import * as migration_20260729_101237_contact_page from './20260729_101237_contact_page';
import * as migration_20260729_101856_safety_page from './20260729_101856_safety_page';
import * as migration_20260729_102155_faq_page from './20260729_102155_faq_page';
import * as migration_20260729_102545_about_page from './20260729_102545_about_page';

export const migrations = [
  {
    up: migration_20260729_085857_initial.up,
    down: migration_20260729_085857_initial.down,
    name: '20260729_085857_initial',
  },
  {
    up: migration_20260729_094717_home_page.up,
    down: migration_20260729_094717_home_page.down,
    name: '20260729_094717_home_page',
  },
  {
    up: migration_20260729_100836_home_sections.up,
    down: migration_20260729_100836_home_sections.down,
    name: '20260729_100836_home_sections',
  },
  {
    up: migration_20260729_101237_contact_page.up,
    down: migration_20260729_101237_contact_page.down,
    name: '20260729_101237_contact_page',
  },
  {
    up: migration_20260729_101856_safety_page.up,
    down: migration_20260729_101856_safety_page.down,
    name: '20260729_101856_safety_page',
  },
  {
    up: migration_20260729_102155_faq_page.up,
    down: migration_20260729_102155_faq_page.down,
    name: '20260729_102155_faq_page',
  },
  {
    up: migration_20260729_102545_about_page.up,
    down: migration_20260729_102545_about_page.down,
    name: '20260729_102545_about_page'
  },
];
