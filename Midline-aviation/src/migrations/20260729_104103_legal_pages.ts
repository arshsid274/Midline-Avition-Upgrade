import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`legal_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`privacy_title\` text,
  	\`privacy_updated\` text,
  	\`terms_title\` text,
  	\`terms_updated\` text,
  	\`cookies_title\` text,
  	\`cookies_updated\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages__status_idx\` ON \`legal_pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_legal_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_privacy_title\` text,
  	\`version_privacy_updated\` text,
  	\`version_terms_title\` text,
  	\`version_terms_updated\` text,
  	\`version_cookies_title\` text,
  	\`version_cookies_updated\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_version_version__status_idx\` ON \`_legal_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_created_at_idx\` ON \`_legal_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_updated_at_idx\` ON \`_legal_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_latest_idx\` ON \`_legal_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_autosave_idx\` ON \`_legal_pages_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`legal_pages\`;`)
  await db.run(sql`DROP TABLE \`_legal_pages_v\`;`)
}
