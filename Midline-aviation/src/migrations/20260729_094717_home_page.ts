import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading_line1\` text,
  	\`hero_heading_accent\` text,
  	\`hero_heading_rest\` text,
  	\`hero_body\` text,
  	\`hero_cta_label\` text,
  	\`hero_cta_href\` text,
  	\`hero_video_url\` text,
  	\`hero_poster_id\` integer,
  	\`cta_banner_heading\` text,
  	\`cta_banner_body\` text,
  	\`cta_banner_primary_label\` text,
  	\`cta_banner_primary_href\` text,
  	\`cta_banner_secondary_label\` text,
  	\`cta_banner_secondary_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_hero_hero_poster_idx\` ON \`home_page\` (\`hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page__status_idx\` ON \`home_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading_line1\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_heading_rest\` text,
  	\`version_hero_body\` text,
  	\`version_hero_cta_label\` text,
  	\`version_hero_cta_href\` text,
  	\`version_hero_video_url\` text,
  	\`version_hero_poster_id\` integer,
  	\`version_cta_banner_heading\` text,
  	\`version_cta_banner_body\` text,
  	\`version_cta_banner_primary_label\` text,
  	\`version_cta_banner_primary_href\` text,
  	\`version_cta_banner_secondary_label\` text,
  	\`version_cta_banner_secondary_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_hero_version_hero_poster_idx\` ON \`_home_page_v\` (\`version_hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_version__status_idx\` ON \`_home_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_created_at_idx\` ON \`_home_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_updated_at_idx\` ON \`_home_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_latest_idx\` ON \`_home_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_autosave_idx\` ON \`_home_page_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v\`;`)
}
