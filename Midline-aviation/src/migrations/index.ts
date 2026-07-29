import * as migration_20260729_085857_initial from './20260729_085857_initial';
import * as migration_20260729_094717_home_page from './20260729_094717_home_page';
import * as migration_20260729_100836_home_sections from './20260729_100836_home_sections';
import * as migration_20260729_101237_contact_page from './20260729_101237_contact_page';
import * as migration_20260729_101856_safety_page from './20260729_101856_safety_page';
import * as migration_20260729_102155_faq_page from './20260729_102155_faq_page';
import * as migration_20260729_102545_about_page from './20260729_102545_about_page';
import * as migration_20260729_102835_service_pages from './20260729_102835_service_pages';
import * as migration_20260729_103235_gallery_items from './20260729_103235_gallery_items';
import * as migration_20260729_103453_aircraft from './20260729_103453_aircraft';
import * as migration_20260729_103853_fleet_page from './20260729_103853_fleet_page';
import * as migration_20260729_104103_legal_pages from './20260729_104103_legal_pages';

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
    name: '20260729_102545_about_page',
  },
  {
    up: migration_20260729_102835_service_pages.up,
    down: migration_20260729_102835_service_pages.down,
    name: '20260729_102835_service_pages',
  },
  {
    up: migration_20260729_103235_gallery_items.up,
    down: migration_20260729_103235_gallery_items.down,
    name: '20260729_103235_gallery_items',
  },
  {
    up: migration_20260729_103453_aircraft.up,
    down: migration_20260729_103453_aircraft.down,
    name: '20260729_103453_aircraft',
  },
  {
    up: migration_20260729_103853_fleet_page.up,
    down: migration_20260729_103853_fleet_page.down,
    name: '20260729_103853_fleet_page',
  },
  {
    up: migration_20260729_104103_legal_pages.up,
    down: migration_20260729_104103_legal_pages.down,
    name: '20260729_104103_legal_pages'
  },
];
