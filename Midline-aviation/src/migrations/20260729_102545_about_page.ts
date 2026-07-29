import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`about_page_what_we_do_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`image_position\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_what_we_do_slides_order_idx\` ON \`about_page_what_we_do_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_what_we_do_slides_parent_id_idx\` ON \`about_page_what_we_do_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_what_we_do_slides_image_idx\` ON \`about_page_what_we_do_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_story_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_story_paragraphs_order_idx\` ON \`about_page_story_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_story_paragraphs_parent_id_idx\` ON \`about_page_story_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_sustainability_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_sustainability_points_order_idx\` ON \`about_page_sustainability_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_sustainability_points_parent_id_idx\` ON \`about_page_sustainability_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_leadership_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`title\` text,
  	\`bio\` text,
  	\`photo_id\` integer,
  	\`object_position\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_leadership_members_order_idx\` ON \`about_page_leadership_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_leadership_members_parent_id_idx\` ON \`about_page_leadership_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_leadership_members_photo_idx\` ON \`about_page_leadership_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`what_we_do_heading\` text,
  	\`story_heading\` text,
  	\`story_image_id\` integer,
  	\`sustainability_eyebrow\` text,
  	\`sustainability_heading\` text,
  	\`sustainability_intro\` text,
  	\`sustainability_image_id\` integer,
  	\`sustainability_card_title\` text,
  	\`sustainability_card_body\` text,
  	\`sustainability_link_label\` text,
  	\`sustainability_link_href\` text,
  	\`leadership_eyebrow\` text,
  	\`leadership_heading\` text,
  	\`leadership_intro\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`story_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`sustainability_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_story_story_image_idx\` ON \`about_page\` (\`story_image_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_sustainability_sustainability_image_idx\` ON \`about_page\` (\`sustainability_image_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page__status_idx\` ON \`about_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_what_we_do_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`image_position\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_what_we_do_slides_order_idx\` ON \`_about_page_v_version_what_we_do_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_what_we_do_slides_parent_id_idx\` ON \`_about_page_v_version_what_we_do_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_what_we_do_slides_image_idx\` ON \`_about_page_v_version_what_we_do_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_story_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_story_paragraphs_order_idx\` ON \`_about_page_v_version_story_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_story_paragraphs_parent_id_idx\` ON \`_about_page_v_version_story_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_sustainability_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_sustainability_points_order_idx\` ON \`_about_page_v_version_sustainability_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_sustainability_points_parent_id_idx\` ON \`_about_page_v_version_sustainability_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_leadership_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`title\` text,
  	\`bio\` text,
  	\`photo_id\` integer,
  	\`object_position\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_leadership_members_order_idx\` ON \`_about_page_v_version_leadership_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_leadership_members_parent_id_idx\` ON \`_about_page_v_version_leadership_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_leadership_members_photo_idx\` ON \`_about_page_v_version_leadership_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_what_we_do_heading\` text,
  	\`version_story_heading\` text,
  	\`version_story_image_id\` integer,
  	\`version_sustainability_eyebrow\` text,
  	\`version_sustainability_heading\` text,
  	\`version_sustainability_intro\` text,
  	\`version_sustainability_image_id\` integer,
  	\`version_sustainability_card_title\` text,
  	\`version_sustainability_card_body\` text,
  	\`version_sustainability_link_label\` text,
  	\`version_sustainability_link_href\` text,
  	\`version_leadership_eyebrow\` text,
  	\`version_leadership_heading\` text,
  	\`version_leadership_intro\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_story_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_sustainability_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_story_version_story_image_idx\` ON \`_about_page_v\` (\`version_story_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_sustainability_version_sustainabil_idx\` ON \`_about_page_v\` (\`version_sustainability_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_version__status_idx\` ON \`_about_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_created_at_idx\` ON \`_about_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_updated_at_idx\` ON \`_about_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_latest_idx\` ON \`_about_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_autosave_idx\` ON \`_about_page_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about_page_what_we_do_slides\`;`)
  await db.run(sql`DROP TABLE \`about_page_story_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`about_page_sustainability_points\`;`)
  await db.run(sql`DROP TABLE \`about_page_leadership_members\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_what_we_do_slides\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_story_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_sustainability_points\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_leadership_members\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v\`;`)
}
