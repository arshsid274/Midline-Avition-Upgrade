import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Repairs databases where `_key` / `prefix` were dropped from media and videos.
 *
 * Those columns belong to the UploadThing storage adapter, which the config
 * enables only when UPLOADTHING_TOKEN is set:
 *
 *     uploadthingStorage({ enabled: Boolean(process.env.UPLOADTHING_TOKEN) })
 *
 * That makes the generated schema depend on the environment, and
 * `payload migrate:create` writes whatever it sees. Run without the token, the
 * adapter is off, its columns are absent from the generated schema, and Drizzle
 * reads that as "these columns were deleted" — emitting DROP COLUMN for all
 * five. 20260805_085315_home_services_section shipped exactly that, and on
 * Vercel (where the token IS set) every media query then failed with
 * "no such column: _key", taking the build down during prerender.
 *
 * 20260731_074350_uploadthing_key is the same mistake in the other direction:
 * generated with the token set, against a snapshot without it.
 *
 * Conditional because this has to be a no-op on a database that never lost the
 * columns. A fresh database gets them from 20260731_074350_uploadthing_key and
 * arrives here intact; only a database migrated through the broken version is
 * missing them. SQLite has no ADD COLUMN IF NOT EXISTS, so PRAGMA table_info is
 * the check.
 *
 * To avoid a repeat: set UPLOADTHING_TOKEN when running `migrate:create`, and
 * check the generated file for DROP COLUMN statements you did not intend.
 */

const columnExists = async (
  db: MigrateUpArgs['db'],
  table: string,
  column: string
): Promise<boolean> => {
  const result = await db.run(sql.raw(`PRAGMA table_info(\`${table}\`)`))
  return (result.rows as unknown as { name: string }[]).some((row) => row.name === column)
}

/** ADD COLUMN, unless the column is already there. */
const addColumnIfMissing = async (
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
  definition: string
): Promise<void> => {
  if (await columnExists(db, table, column)) return
  await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`))
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await addColumnIfMissing(db, 'media', '_key', 'text')
  await addColumnIfMissing(db, 'media', 'prefix', "text DEFAULT ''")
  await addColumnIfMissing(db, 'media', 'sizes_thumbnail__key', 'text')
  await addColumnIfMissing(db, 'videos', '_key', 'text')
  await addColumnIfMissing(db, 'videos', 'prefix', "text DEFAULT ''")
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentionally empty. This migration only restores columns that
  // 20260731_074350_uploadthing_key is responsible for; dropping them here
  // would re-create the very breakage it exists to repair.
}
