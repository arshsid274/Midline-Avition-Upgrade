import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`fleet_page_interior_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fleet_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fleet_page_interior_tiles_order_idx\` ON \`fleet_page_interior_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fleet_page_interior_tiles_parent_id_idx\` ON \`fleet_page_interior_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`fleet_page_interior_tiles_image_idx\` ON \`fleet_page_interior_tiles\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`fleet_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_heading\` text,
  	\`hero_body\` text,
  	\`hero_video_url\` text,
  	\`hero_poster_id\` integer,
  	\`comparison_eyebrow\` text,
  	\`comparison_heading\` text,
  	\`comparison_intro\` text,
  	\`interior_heading\` text,
  	\`interior_link_label\` text,
  	\`interior_link_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`fleet_page_hero_hero_poster_idx\` ON \`fleet_page\` (\`hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`fleet_page__status_idx\` ON \`fleet_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_fleet_page_v_version_interior_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_fleet_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_interior_tiles_order_idx\` ON \`_fleet_page_v_version_interior_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_interior_tiles_parent_id_idx\` ON \`_fleet_page_v_version_interior_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_interior_tiles_image_idx\` ON \`_fleet_page_v_version_interior_tiles\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_fleet_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_heading\` text,
  	\`version_hero_body\` text,
  	\`version_hero_video_url\` text,
  	\`version_hero_poster_id\` integer,
  	\`version_comparison_eyebrow\` text,
  	\`version_comparison_heading\` text,
  	\`version_comparison_intro\` text,
  	\`version_interior_heading\` text,
  	\`version_interior_link_label\` text,
  	\`version_interior_link_href\` text,
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
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_hero_version_hero_poster_idx\` ON \`_fleet_page_v\` (\`version_hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_version__status_idx\` ON \`_fleet_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_created_at_idx\` ON \`_fleet_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_updated_at_idx\` ON \`_fleet_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_latest_idx\` ON \`_fleet_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_autosave_idx\` ON \`_fleet_page_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`fleet_page_interior_tiles\`;`)
  await db.run(sql`DROP TABLE \`fleet_page\`;`)
  await db.run(sql`DROP TABLE \`_fleet_page_v_version_interior_tiles\`;`)
  await db.run(sql`DROP TABLE \`_fleet_page_v\`;`)
}
