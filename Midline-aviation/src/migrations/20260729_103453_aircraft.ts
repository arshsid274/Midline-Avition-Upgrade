import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`aircraft_description\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aircraft\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aircraft_description_order_idx\` ON \`aircraft_description\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_description_parent_id_idx\` ON \`aircraft_description\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`aircraft_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` numeric NOT NULL,
  	\`unit\` text,
  	\`decimals\` numeric,
  	\`note\` text,
  	\`display_value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aircraft\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aircraft_specs_order_idx\` ON \`aircraft_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_specs_parent_id_idx\` ON \`aircraft_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`aircraft_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`span\` text DEFAULT 'standard',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aircraft\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aircraft_gallery_order_idx\` ON \`aircraft_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_gallery_parent_id_idx\` ON \`aircraft_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_gallery_image_idx\` ON \`aircraft_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`aircraft_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aircraft\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aircraft_seo_keywords_order_idx\` ON \`aircraft_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_seo_keywords_parent_id_idx\` ON \`aircraft_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`aircraft\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`tail\` text NOT NULL,
  	\`category\` text,
  	\`tagline\` text,
  	\`hero_image_id\` integer NOT NULL,
  	\`hero_video_url\` text,
  	\`vertical_video_url\` text,
  	\`vertical_video_poster_id\` integer,
  	\`vertical_video_heading\` text,
  	\`vertical_video_caption\` text,
  	\`slug\` text NOT NULL,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`og_image\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`vertical_video_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`aircraft_hero_image_idx\` ON \`aircraft\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_vertical_video_vertical_video_poster_idx\` ON \`aircraft\` (\`vertical_video_poster_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`aircraft_slug_idx\` ON \`aircraft\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_updated_at_idx\` ON \`aircraft\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_created_at_idx\` ON \`aircraft\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`aircraft_id\` integer REFERENCES aircraft(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_aircraft_id_idx\` ON \`payload_locked_documents_rels\` (\`aircraft_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`aircraft_description\`;`)
  await db.run(sql`DROP TABLE \`aircraft_specs\`;`)
  await db.run(sql`DROP TABLE \`aircraft_gallery\`;`)
  await db.run(sql`DROP TABLE \`aircraft_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`aircraft\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`accreditations_id\` integer,
  	\`gallery_items_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`accreditations_id\`) REFERENCES \`accreditations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gallery_items_id\`) REFERENCES \`gallery_items\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "accreditations_id", "gallery_items_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "accreditations_id", "gallery_items_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_accreditations_id_idx\` ON \`payload_locked_documents_rels\` (\`accreditations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gallery_items_id_idx\` ON \`payload_locked_documents_rels\` (\`gallery_items_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
}
