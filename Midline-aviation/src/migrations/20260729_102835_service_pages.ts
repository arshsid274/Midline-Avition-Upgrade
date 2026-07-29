import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`charter_page_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`charter_page_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`charter_page_features_cards_points_order_idx\` ON \`charter_page_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`charter_page_features_cards_points_parent_id_idx\` ON \`charter_page_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`charter_page_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`charter_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`charter_page_features_cards_order_idx\` ON \`charter_page_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`charter_page_features_cards_parent_id_idx\` ON \`charter_page_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`charter_page_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`charter_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`charter_page_showcase_cards_order_idx\` ON \`charter_page_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`charter_page_showcase_cards_parent_id_idx\` ON \`charter_page_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`charter_page_showcase_cards_image_idx\` ON \`charter_page_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`charter_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_heading_accent\` text,
  	\`hero_body\` text,
  	\`hero_image_id\` integer,
  	\`hero_primary_label\` text,
  	\`hero_primary_href\` text,
  	\`hero_secondary_label\` text,
  	\`hero_secondary_href\` text,
  	\`features_eyebrow\` text,
  	\`features_heading\` text,
  	\`features_intro\` text,
  	\`showcase_eyebrow\` text,
  	\`showcase_heading\` text,
  	\`showcase_intro\` text,
  	\`closing_eyebrow\` text,
  	\`closing_heading\` text,
  	\`closing_body\` text,
  	\`closing_cta_label\` text,
  	\`closing_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`charter_page_hero_hero_image_idx\` ON \`charter_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`charter_page__status_idx\` ON \`charter_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_charter_page_v_version_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_charter_page_v_version_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_features_cards_points_order_idx\` ON \`_charter_page_v_version_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_features_cards_points_parent_id_idx\` ON \`_charter_page_v_version_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_charter_page_v_version_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_charter_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_features_cards_order_idx\` ON \`_charter_page_v_version_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_features_cards_parent_id_idx\` ON \`_charter_page_v_version_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_charter_page_v_version_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_charter_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_showcase_cards_order_idx\` ON \`_charter_page_v_version_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_showcase_cards_parent_id_idx\` ON \`_charter_page_v_version_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_showcase_cards_image_idx\` ON \`_charter_page_v_version_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_charter_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_body\` text,
  	\`version_hero_image_id\` integer,
  	\`version_hero_primary_label\` text,
  	\`version_hero_primary_href\` text,
  	\`version_hero_secondary_label\` text,
  	\`version_hero_secondary_href\` text,
  	\`version_features_eyebrow\` text,
  	\`version_features_heading\` text,
  	\`version_features_intro\` text,
  	\`version_showcase_eyebrow\` text,
  	\`version_showcase_heading\` text,
  	\`version_showcase_intro\` text,
  	\`version_closing_eyebrow\` text,
  	\`version_closing_heading\` text,
  	\`version_closing_body\` text,
  	\`version_closing_cta_label\` text,
  	\`version_closing_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_hero_version_hero_image_idx\` ON \`_charter_page_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_version_version__status_idx\` ON \`_charter_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_created_at_idx\` ON \`_charter_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_updated_at_idx\` ON \`_charter_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_latest_idx\` ON \`_charter_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_charter_page_v_autosave_idx\` ON \`_charter_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`management_page_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`management_page_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`management_page_features_cards_points_order_idx\` ON \`management_page_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`management_page_features_cards_points_parent_id_idx\` ON \`management_page_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`management_page_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`management_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`management_page_features_cards_order_idx\` ON \`management_page_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`management_page_features_cards_parent_id_idx\` ON \`management_page_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`management_page_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`management_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`management_page_showcase_cards_order_idx\` ON \`management_page_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`management_page_showcase_cards_parent_id_idx\` ON \`management_page_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`management_page_showcase_cards_image_idx\` ON \`management_page_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`management_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_heading_accent\` text,
  	\`hero_body\` text,
  	\`hero_image_id\` integer,
  	\`hero_primary_label\` text,
  	\`hero_primary_href\` text,
  	\`hero_secondary_label\` text,
  	\`hero_secondary_href\` text,
  	\`features_eyebrow\` text,
  	\`features_heading\` text,
  	\`features_intro\` text,
  	\`showcase_eyebrow\` text,
  	\`showcase_heading\` text,
  	\`showcase_intro\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`management_page_hero_hero_image_idx\` ON \`management_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`management_page__status_idx\` ON \`management_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_management_page_v_version_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_management_page_v_version_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_features_cards_points_order_idx\` ON \`_management_page_v_version_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_features_cards_points_parent_id_idx\` ON \`_management_page_v_version_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_management_page_v_version_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_management_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_features_cards_order_idx\` ON \`_management_page_v_version_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_features_cards_parent_id_idx\` ON \`_management_page_v_version_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_management_page_v_version_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_management_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_showcase_cards_order_idx\` ON \`_management_page_v_version_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_showcase_cards_parent_id_idx\` ON \`_management_page_v_version_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_showcase_cards_image_idx\` ON \`_management_page_v_version_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_management_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_body\` text,
  	\`version_hero_image_id\` integer,
  	\`version_hero_primary_label\` text,
  	\`version_hero_primary_href\` text,
  	\`version_hero_secondary_label\` text,
  	\`version_hero_secondary_href\` text,
  	\`version_features_eyebrow\` text,
  	\`version_features_heading\` text,
  	\`version_features_intro\` text,
  	\`version_showcase_eyebrow\` text,
  	\`version_showcase_heading\` text,
  	\`version_showcase_intro\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_hero_version_hero_image_idx\` ON \`_management_page_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_version__status_idx\` ON \`_management_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_created_at_idx\` ON \`_management_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_updated_at_idx\` ON \`_management_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_latest_idx\` ON \`_management_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_autosave_idx\` ON \`_management_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`sales_page_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`sales_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`sales_page_showcase_cards_order_idx\` ON \`sales_page_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`sales_page_showcase_cards_parent_id_idx\` ON \`sales_page_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`sales_page_showcase_cards_image_idx\` ON \`sales_page_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`sales_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_heading_accent\` text,
  	\`hero_body\` text,
  	\`hero_image_id\` integer,
  	\`hero_primary_label\` text,
  	\`hero_primary_href\` text,
  	\`hero_secondary_label\` text,
  	\`hero_secondary_href\` text,
  	\`showcase_eyebrow\` text,
  	\`showcase_heading\` text,
  	\`showcase_intro\` text,
  	\`closing_eyebrow\` text,
  	\`closing_heading\` text,
  	\`closing_body\` text,
  	\`closing_cta_label\` text,
  	\`closing_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`sales_page_hero_hero_image_idx\` ON \`sales_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`sales_page__status_idx\` ON \`sales_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_sales_page_v_version_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_sales_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_showcase_cards_order_idx\` ON \`_sales_page_v_version_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_showcase_cards_parent_id_idx\` ON \`_sales_page_v_version_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_showcase_cards_image_idx\` ON \`_sales_page_v_version_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_sales_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_body\` text,
  	\`version_hero_image_id\` integer,
  	\`version_hero_primary_label\` text,
  	\`version_hero_primary_href\` text,
  	\`version_hero_secondary_label\` text,
  	\`version_hero_secondary_href\` text,
  	\`version_showcase_eyebrow\` text,
  	\`version_showcase_heading\` text,
  	\`version_showcase_intro\` text,
  	\`version_closing_eyebrow\` text,
  	\`version_closing_heading\` text,
  	\`version_closing_body\` text,
  	\`version_closing_cta_label\` text,
  	\`version_closing_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_hero_version_hero_image_idx\` ON \`_sales_page_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_version__status_idx\` ON \`_sales_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_created_at_idx\` ON \`_sales_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_updated_at_idx\` ON \`_sales_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_latest_idx\` ON \`_sales_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_autosave_idx\` ON \`_sales_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`cargo_page_hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cargo_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cargo_page_hero_stats_order_idx\` ON \`cargo_page_hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cargo_page_hero_stats_parent_id_idx\` ON \`cargo_page_hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cargo_page_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cargo_page_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cargo_page_features_cards_points_order_idx\` ON \`cargo_page_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cargo_page_features_cards_points_parent_id_idx\` ON \`cargo_page_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cargo_page_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cargo_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cargo_page_features_cards_order_idx\` ON \`cargo_page_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cargo_page_features_cards_parent_id_idx\` ON \`cargo_page_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cargo_page_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cargo_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cargo_page_showcase_cards_order_idx\` ON \`cargo_page_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cargo_page_showcase_cards_parent_id_idx\` ON \`cargo_page_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cargo_page_showcase_cards_image_idx\` ON \`cargo_page_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`cargo_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_heading_accent\` text,
  	\`hero_body\` text,
  	\`hero_image_id\` integer,
  	\`hero_primary_label\` text,
  	\`hero_primary_href\` text,
  	\`hero_secondary_label\` text,
  	\`hero_secondary_href\` text,
  	\`features_eyebrow\` text,
  	\`features_heading\` text,
  	\`features_intro\` text,
  	\`showcase_eyebrow\` text,
  	\`showcase_heading\` text,
  	\`showcase_intro\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`cargo_page_hero_hero_image_idx\` ON \`cargo_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`cargo_page__status_idx\` ON \`cargo_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_cargo_page_v_version_hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cargo_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_hero_stats_order_idx\` ON \`_cargo_page_v_version_hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_hero_stats_parent_id_idx\` ON \`_cargo_page_v_version_hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_cargo_page_v_version_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cargo_page_v_version_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_features_cards_points_order_idx\` ON \`_cargo_page_v_version_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_features_cards_points_parent_id_idx\` ON \`_cargo_page_v_version_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_cargo_page_v_version_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cargo_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_features_cards_order_idx\` ON \`_cargo_page_v_version_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_features_cards_parent_id_idx\` ON \`_cargo_page_v_version_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_cargo_page_v_version_showcase_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cargo_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_showcase_cards_order_idx\` ON \`_cargo_page_v_version_showcase_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_showcase_cards_parent_id_idx\` ON \`_cargo_page_v_version_showcase_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_showcase_cards_image_idx\` ON \`_cargo_page_v_version_showcase_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_cargo_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_body\` text,
  	\`version_hero_image_id\` integer,
  	\`version_hero_primary_label\` text,
  	\`version_hero_primary_href\` text,
  	\`version_hero_secondary_label\` text,
  	\`version_hero_secondary_href\` text,
  	\`version_features_eyebrow\` text,
  	\`version_features_heading\` text,
  	\`version_features_intro\` text,
  	\`version_showcase_eyebrow\` text,
  	\`version_showcase_heading\` text,
  	\`version_showcase_intro\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_hero_version_hero_image_idx\` ON \`_cargo_page_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_version__status_idx\` ON \`_cargo_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_created_at_idx\` ON \`_cargo_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_updated_at_idx\` ON \`_cargo_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_latest_idx\` ON \`_cargo_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_autosave_idx\` ON \`_cargo_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`mro_page_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`mro_page_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`mro_page_features_cards_points_order_idx\` ON \`mro_page_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`mro_page_features_cards_points_parent_id_idx\` ON \`mro_page_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`mro_page_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`mro_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`mro_page_features_cards_order_idx\` ON \`mro_page_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`mro_page_features_cards_parent_id_idx\` ON \`mro_page_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`mro_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_heading_accent\` text,
  	\`hero_body\` text,
  	\`hero_image_id\` integer,
  	\`hero_primary_label\` text,
  	\`hero_primary_href\` text,
  	\`hero_secondary_label\` text,
  	\`hero_secondary_href\` text,
  	\`features_eyebrow\` text,
  	\`features_heading\` text,
  	\`features_intro\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`mro_page_hero_hero_image_idx\` ON \`mro_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`mro_page__status_idx\` ON \`mro_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_mro_page_v_version_features_cards_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_mro_page_v_version_features_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_mro_page_v_version_features_cards_points_order_idx\` ON \`_mro_page_v_version_features_cards_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_mro_page_v_version_features_cards_points_parent_id_idx\` ON \`_mro_page_v_version_features_cards_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_mro_page_v_version_features_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_mro_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_mro_page_v_version_features_cards_order_idx\` ON \`_mro_page_v_version_features_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_mro_page_v_version_features_cards_parent_id_idx\` ON \`_mro_page_v_version_features_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_mro_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_body\` text,
  	\`version_hero_image_id\` integer,
  	\`version_hero_primary_label\` text,
  	\`version_hero_primary_href\` text,
  	\`version_hero_secondary_label\` text,
  	\`version_hero_secondary_href\` text,
  	\`version_features_eyebrow\` text,
  	\`version_features_heading\` text,
  	\`version_features_intro\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_mro_page_v_version_hero_version_hero_image_idx\` ON \`_mro_page_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_mro_page_v_version_version__status_idx\` ON \`_mro_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_mro_page_v_created_at_idx\` ON \`_mro_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_mro_page_v_updated_at_idx\` ON \`_mro_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_mro_page_v_latest_idx\` ON \`_mro_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_mro_page_v_autosave_idx\` ON \`_mro_page_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`charter_page_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`charter_page_features_cards\`;`)
  await db.run(sql`DROP TABLE \`charter_page_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`charter_page\`;`)
  await db.run(sql`DROP TABLE \`_charter_page_v_version_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`_charter_page_v_version_features_cards\`;`)
  await db.run(sql`DROP TABLE \`_charter_page_v_version_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`_charter_page_v\`;`)
  await db.run(sql`DROP TABLE \`management_page_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`management_page_features_cards\`;`)
  await db.run(sql`DROP TABLE \`management_page_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`management_page\`;`)
  await db.run(sql`DROP TABLE \`_management_page_v_version_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`_management_page_v_version_features_cards\`;`)
  await db.run(sql`DROP TABLE \`_management_page_v_version_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`_management_page_v\`;`)
  await db.run(sql`DROP TABLE \`sales_page_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`sales_page\`;`)
  await db.run(sql`DROP TABLE \`_sales_page_v_version_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`_sales_page_v\`;`)
  await db.run(sql`DROP TABLE \`cargo_page_hero_stats\`;`)
  await db.run(sql`DROP TABLE \`cargo_page_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`cargo_page_features_cards\`;`)
  await db.run(sql`DROP TABLE \`cargo_page_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`cargo_page\`;`)
  await db.run(sql`DROP TABLE \`_cargo_page_v_version_hero_stats\`;`)
  await db.run(sql`DROP TABLE \`_cargo_page_v_version_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`_cargo_page_v_version_features_cards\`;`)
  await db.run(sql`DROP TABLE \`_cargo_page_v_version_showcase_cards\`;`)
  await db.run(sql`DROP TABLE \`_cargo_page_v\`;`)
  await db.run(sql`DROP TABLE \`mro_page_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`mro_page_features_cards\`;`)
  await db.run(sql`DROP TABLE \`mro_page\`;`)
  await db.run(sql`DROP TABLE \`_mro_page_v_version_features_cards_points\`;`)
  await db.run(sql`DROP TABLE \`_mro_page_v_version_features_cards\`;`)
  await db.run(sql`DROP TABLE \`_mro_page_v\`;`)
}
