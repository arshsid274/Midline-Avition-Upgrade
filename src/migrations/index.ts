import * as migration_20260730_073910_baseline from './20260730_073910_baseline';
import * as migration_20260731_074350_uploadthing_key from './20260731_074350_uploadthing_key';
import * as migration_20260731_095009_service_sections from './20260731_095009_service_sections';
import * as migration_20260731_120219_service_sections_complete from './20260731_120219_service_sections_complete';
import * as migration_20260805_083047_remove_marketplace_section from './20260805_083047_remove_marketplace_section';

export const migrations = [
  {
    up: migration_20260730_073910_baseline.up,
    down: migration_20260730_073910_baseline.down,
    name: '20260730_073910_baseline',
  },
  {
    up: migration_20260731_074350_uploadthing_key.up,
    down: migration_20260731_074350_uploadthing_key.down,
    name: '20260731_074350_uploadthing_key',
  },
  {
    up: migration_20260731_095009_service_sections.up,
    down: migration_20260731_095009_service_sections.down,
    name: '20260731_095009_service_sections',
  },
  {
    up: migration_20260731_120219_service_sections_complete.up,
    down: migration_20260731_120219_service_sections_complete.down,
    name: '20260731_120219_service_sections_complete',
  },
  {
    up: migration_20260805_083047_remove_marketplace_section.up,
    down: migration_20260805_083047_remove_marketplace_section.down,
    name: '20260805_083047_remove_marketplace_section'
  },
];
