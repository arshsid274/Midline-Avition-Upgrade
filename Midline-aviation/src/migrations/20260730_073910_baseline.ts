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
  	\`hero_video_url_id\` integer,
  	\`vertical_video_url_id\` integer,
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
  	FOREIGN KEY (\`hero_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`vertical_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`vertical_video_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`aircraft_hero_image_idx\` ON \`aircraft\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_hero_video_url_idx\` ON \`aircraft\` (\`hero_video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_vertical_video_vertical_video_url_idx\` ON \`aircraft\` (\`vertical_video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_vertical_video_vertical_video_poster_idx\` ON \`aircraft\` (\`vertical_video_poster_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`aircraft_slug_idx\` ON \`aircraft\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_updated_at_idx\` ON \`aircraft\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`aircraft_created_at_idx\` ON \`aircraft\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`accreditations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	\`name\` text NOT NULL,
  	\`short_name\` text NOT NULL,
  	\`kind\` text DEFAULT 'membership' NOT NULL,
  	\`enabled\` integer DEFAULT false,
  	\`notes\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`accreditations_key_idx\` ON \`accreditations\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`accreditations_logo_idx\` ON \`accreditations\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`accreditations_updated_at_idx\` ON \`accreditations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`accreditations_created_at_idx\` ON \`accreditations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`gallery_items\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text DEFAULT 'image' NOT NULL,
  	\`image_id\` integer,
  	\`video_url_id\` integer,
  	\`poster_id\` integer,
  	\`caption\` text NOT NULL,
  	\`alt\` text NOT NULL,
  	\`category\` text NOT NULL,
  	\`orientation\` text DEFAULT 'landscape' NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`gallery_items_image_idx\` ON \`gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_video_url_idx\` ON \`gallery_items\` (\`video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_poster_idx\` ON \`gallery_items\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_updated_at_idx\` ON \`gallery_items\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_created_at_idx\` ON \`gallery_items\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`source_path\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_source_path_idx\` ON \`media\` (\`source_path\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE TABLE \`videos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`source_path\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`videos_source_path_idx\` ON \`videos\` (\`source_path\`);`)
  await db.run(sql`CREATE INDEX \`videos_updated_at_idx\` ON \`videos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`videos_created_at_idx\` ON \`videos\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`videos_filename_idx\` ON \`videos\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`aircraft_id\` integer,
  	\`accreditations_id\` integer,
  	\`gallery_items_id\` integer,
  	\`media_id\` integer,
  	\`videos_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`aircraft_id\`) REFERENCES \`aircraft\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`accreditations_id\`) REFERENCES \`accreditations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gallery_items_id\`) REFERENCES \`gallery_items\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`videos_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_aircraft_id_idx\` ON \`payload_locked_documents_rels\` (\`aircraft_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_accreditations_id_idx\` ON \`payload_locked_documents_rels\` (\`accreditations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gallery_items_id_idx\` ON \`payload_locked_documents_rels\` (\`gallery_items_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_videos_id_idx\` ON \`payload_locked_documents_rels\` (\`videos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`home_page_showcase_panels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`subtitle\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`image_on_right\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_showcase_panels_order_idx\` ON \`home_page_showcase_panels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_showcase_panels_parent_id_idx\` ON \`home_page_showcase_panels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_showcase_panels_image_idx\` ON \`home_page_showcase_panels\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_destinations_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_destinations_cards_order_idx\` ON \`home_page_destinations_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_destinations_cards_parent_id_idx\` ON \`home_page_destinations_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_destinations_cards_image_idx\` ON \`home_page_destinations_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_marketplace_jet_visuals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`exterior_id\` integer,
  	\`interior_id\` integer,
  	FOREIGN KEY (\`exterior_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`interior_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_marketplace_jet_visuals_order_idx\` ON \`home_page_marketplace_jet_visuals\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_marketplace_jet_visuals_parent_id_idx\` ON \`home_page_marketplace_jet_visuals\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_marketplace_jet_visuals_exterior_idx\` ON \`home_page_marketplace_jet_visuals\` (\`exterior_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_marketplace_jet_visuals_interior_idx\` ON \`home_page_marketplace_jet_visuals\` (\`interior_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_fleet_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`registration\` text,
  	\`coming_soon\` integer,
  	\`video_url_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_fleet_cards_order_idx\` ON \`home_page_fleet_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_fleet_cards_parent_id_idx\` ON \`home_page_fleet_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_fleet_cards_image_idx\` ON \`home_page_fleet_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_fleet_cards_video_url_idx\` ON \`home_page_fleet_cards\` (\`video_url_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading_line1\` text,
  	\`hero_heading_accent\` text,
  	\`hero_heading_rest\` text,
  	\`hero_body\` text,
  	\`hero_cta_label\` text,
  	\`hero_cta_href\` text,
  	\`hero_video_url_id\` integer,
  	\`hero_poster_id\` integer,
  	\`showcase_heading\` text,
  	\`destinations_heading\` text,
  	\`destinations_intro\` text,
  	\`marketplace_eyebrow\` text,
  	\`marketplace_heading\` text,
  	\`marketplace_intro\` text,
  	\`accreditations_heading\` text,
  	\`fleet_eyebrow\` text,
  	\`fleet_heading\` text,
  	\`fleet_intro\` text,
  	\`cta_banner_heading\` text,
  	\`cta_banner_body\` text,
  	\`cta_banner_primary_label\` text,
  	\`cta_banner_primary_href\` text,
  	\`cta_banner_secondary_label\` text,
  	\`cta_banner_secondary_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_hero_hero_video_url_idx\` ON \`home_page\` (\`hero_video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_hero_hero_poster_idx\` ON \`home_page\` (\`hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page__status_idx\` ON \`home_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_showcase_panels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`subtitle\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`image_on_right\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_showcase_panels_order_idx\` ON \`_home_page_v_version_showcase_panels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_showcase_panels_parent_id_idx\` ON \`_home_page_v_version_showcase_panels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_showcase_panels_image_idx\` ON \`_home_page_v_version_showcase_panels\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_destinations_cards\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_destinations_cards_order_idx\` ON \`_home_page_v_version_destinations_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_destinations_cards_parent_id_idx\` ON \`_home_page_v_version_destinations_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_destinations_cards_image_idx\` ON \`_home_page_v_version_destinations_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_marketplace_jet_visuals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`exterior_id\` integer,
  	\`interior_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`exterior_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`interior_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_marketplace_jet_visuals_order_idx\` ON \`_home_page_v_version_marketplace_jet_visuals\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_marketplace_jet_visuals_parent_id_idx\` ON \`_home_page_v_version_marketplace_jet_visuals\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_marketplace_jet_visuals_exterior_idx\` ON \`_home_page_v_version_marketplace_jet_visuals\` (\`exterior_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_marketplace_jet_visuals_interior_idx\` ON \`_home_page_v_version_marketplace_jet_visuals\` (\`interior_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_fleet_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`registration\` text,
  	\`coming_soon\` integer,
  	\`video_url_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_fleet_cards_order_idx\` ON \`_home_page_v_version_fleet_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_fleet_cards_parent_id_idx\` ON \`_home_page_v_version_fleet_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_fleet_cards_image_idx\` ON \`_home_page_v_version_fleet_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_fleet_cards_video_url_idx\` ON \`_home_page_v_version_fleet_cards\` (\`video_url_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading_line1\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_heading_rest\` text,
  	\`version_hero_body\` text,
  	\`version_hero_cta_label\` text,
  	\`version_hero_cta_href\` text,
  	\`version_hero_video_url_id\` integer,
  	\`version_hero_poster_id\` integer,
  	\`version_showcase_heading\` text,
  	\`version_destinations_heading\` text,
  	\`version_destinations_intro\` text,
  	\`version_marketplace_eyebrow\` text,
  	\`version_marketplace_heading\` text,
  	\`version_marketplace_intro\` text,
  	\`version_accreditations_heading\` text,
  	\`version_fleet_eyebrow\` text,
  	\`version_fleet_heading\` text,
  	\`version_fleet_intro\` text,
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
  	FOREIGN KEY (\`version_hero_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_hero_version_hero_video_url_idx\` ON \`_home_page_v\` (\`version_hero_video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_hero_version_hero_poster_idx\` ON \`_home_page_v\` (\`version_hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_version__status_idx\` ON \`_home_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_created_at_idx\` ON \`_home_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_updated_at_idx\` ON \`_home_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_latest_idx\` ON \`_home_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_autosave_idx\` ON \`_home_page_v\` (\`autosave\`);`)
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
  	\`hero_video_url_id\` integer,
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
  	FOREIGN KEY (\`hero_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`fleet_page_hero_hero_video_url_idx\` ON \`fleet_page\` (\`hero_video_url_id\`);`)
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
  	\`version_hero_video_url_id\` integer,
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
  	FOREIGN KEY (\`version_hero_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_hero_version_hero_video_url_idx\` ON \`_fleet_page_v\` (\`version_hero_video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_hero_version_hero_poster_idx\` ON \`_fleet_page_v\` (\`version_hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_version_version__status_idx\` ON \`_fleet_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_created_at_idx\` ON \`_fleet_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_updated_at_idx\` ON \`_fleet_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_latest_idx\` ON \`_fleet_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_fleet_page_v_autosave_idx\` ON \`_fleet_page_v\` (\`autosave\`);`)
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
  await db.run(sql`CREATE TABLE \`contact_page_details_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`value\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_details_rows_order_idx\` ON \`contact_page_details_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_details_rows_parent_id_idx\` ON \`contact_page_details_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_body\` text,
  	\`hero_video_url_id\` integer,
  	\`hero_poster_id\` integer,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_hero_hero_video_url_idx\` ON \`contact_page\` (\`hero_video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_hero_hero_poster_idx\` ON \`contact_page\` (\`hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_page__status_idx\` ON \`contact_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_details_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`value\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_details_rows_order_idx\` ON \`_contact_page_v_version_details_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_details_rows_parent_id_idx\` ON \`_contact_page_v_version_details_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_body\` text,
  	\`version_hero_video_url_id\` integer,
  	\`version_hero_poster_id\` integer,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_hero_video_url_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_hero_version_hero_video_url_idx\` ON \`_contact_page_v\` (\`version_hero_video_url_id\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_hero_version_hero_poster_idx\` ON \`_contact_page_v\` (\`version_hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_version__status_idx\` ON \`_contact_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_created_at_idx\` ON \`_contact_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_updated_at_idx\` ON \`_contact_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_latest_idx\` ON \`_contact_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_autosave_idx\` ON \`_contact_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`safety_page_operator_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`safety_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`safety_page_operator_facts_order_idx\` ON \`safety_page_operator_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`safety_page_operator_facts_parent_id_idx\` ON \`safety_page_operator_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`safety_page_maintenance_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`safety_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`safety_page_maintenance_facts_order_idx\` ON \`safety_page_maintenance_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`safety_page_maintenance_facts_parent_id_idx\` ON \`safety_page_maintenance_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`safety_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_body\` text,
  	\`operator_eyebrow\` text,
  	\`operator_heading\` text,
  	\`operator_body\` text,
  	\`ratings_eyebrow\` text,
  	\`ratings_heading\` text,
  	\`ratings_card_title\` text,
  	\`ratings_card_body\` text,
  	\`memberships_eyebrow\` text,
  	\`memberships_heading\` text,
  	\`insurance_eyebrow\` text,
  	\`insurance_body\` text,
  	\`maintenance_eyebrow\` text,
  	\`maintenance_heading\` text,
  	\`maintenance_body\` text,
  	\`questions_heading\` text,
  	\`questions_body\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`safety_page__status_idx\` ON \`safety_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_safety_page_v_version_operator_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_safety_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_safety_page_v_version_operator_facts_order_idx\` ON \`_safety_page_v_version_operator_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_safety_page_v_version_operator_facts_parent_id_idx\` ON \`_safety_page_v_version_operator_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_safety_page_v_version_maintenance_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_safety_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_safety_page_v_version_maintenance_facts_order_idx\` ON \`_safety_page_v_version_maintenance_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_safety_page_v_version_maintenance_facts_parent_id_idx\` ON \`_safety_page_v_version_maintenance_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_safety_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_body\` text,
  	\`version_operator_eyebrow\` text,
  	\`version_operator_heading\` text,
  	\`version_operator_body\` text,
  	\`version_ratings_eyebrow\` text,
  	\`version_ratings_heading\` text,
  	\`version_ratings_card_title\` text,
  	\`version_ratings_card_body\` text,
  	\`version_memberships_eyebrow\` text,
  	\`version_memberships_heading\` text,
  	\`version_insurance_eyebrow\` text,
  	\`version_insurance_body\` text,
  	\`version_maintenance_eyebrow\` text,
  	\`version_maintenance_heading\` text,
  	\`version_maintenance_body\` text,
  	\`version_questions_heading\` text,
  	\`version_questions_body\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_safety_page_v_version_version__status_idx\` ON \`_safety_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_safety_page_v_created_at_idx\` ON \`_safety_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_safety_page_v_updated_at_idx\` ON \`_safety_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_safety_page_v_latest_idx\` ON \`_safety_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_safety_page_v_autosave_idx\` ON \`_safety_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`faq_page_groups_items_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`q\` text,
  	\`a\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_page_groups_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_page_groups_items_questions_order_idx\` ON \`faq_page_groups_items_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_page_groups_items_questions_parent_id_idx\` ON \`faq_page_groups_items_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`faq_page_groups_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_page_groups_items_order_idx\` ON \`faq_page_groups_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_page_groups_items_parent_id_idx\` ON \`faq_page_groups_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`faq_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_body\` text,
  	\`closing_heading\` text,
  	\`closing_body_before\` text,
  	\`closing_body_after\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_page__status_idx\` ON \`faq_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_faq_page_v_version_groups_items_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`q\` text,
  	\`a\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_page_v_version_groups_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_page_v_version_groups_items_questions_order_idx\` ON \`_faq_page_v_version_groups_items_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_page_v_version_groups_items_questions_parent_id_idx\` ON \`_faq_page_v_version_groups_items_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_faq_page_v_version_groups_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_page_v_version_groups_items_order_idx\` ON \`_faq_page_v_version_groups_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_page_v_version_groups_items_parent_id_idx\` ON \`_faq_page_v_version_groups_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_faq_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_heading\` text,
  	\`version_hero_body\` text,
  	\`version_closing_heading\` text,
  	\`version_closing_body_before\` text,
  	\`version_closing_body_after\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_page_v_version_version__status_idx\` ON \`_faq_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_faq_page_v_created_at_idx\` ON \`_faq_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_faq_page_v_updated_at_idx\` ON \`_faq_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_faq_page_v_latest_idx\` ON \`_faq_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_faq_page_v_autosave_idx\` ON \`_faq_page_v\` (\`autosave\`);`)
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
  await db.run(sql`DROP TABLE \`aircraft_description\`;`)
  await db.run(sql`DROP TABLE \`aircraft_specs\`;`)
  await db.run(sql`DROP TABLE \`aircraft_gallery\`;`)
  await db.run(sql`DROP TABLE \`aircraft_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`aircraft\`;`)
  await db.run(sql`DROP TABLE \`accreditations\`;`)
  await db.run(sql`DROP TABLE \`gallery_items\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`videos\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`home_page_showcase_panels\`;`)
  await db.run(sql`DROP TABLE \`home_page_destinations_cards\`;`)
  await db.run(sql`DROP TABLE \`home_page_marketplace_jet_visuals\`;`)
  await db.run(sql`DROP TABLE \`home_page_fleet_cards\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_showcase_panels\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_destinations_cards\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_marketplace_jet_visuals\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_fleet_cards\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v\`;`)
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
  await db.run(sql`DROP TABLE \`fleet_page_interior_tiles\`;`)
  await db.run(sql`DROP TABLE \`fleet_page\`;`)
  await db.run(sql`DROP TABLE \`_fleet_page_v_version_interior_tiles\`;`)
  await db.run(sql`DROP TABLE \`_fleet_page_v\`;`)
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
  await db.run(sql`DROP TABLE \`contact_page_details_rows\`;`)
  await db.run(sql`DROP TABLE \`contact_page\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_details_rows\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v\`;`)
  await db.run(sql`DROP TABLE \`safety_page_operator_facts\`;`)
  await db.run(sql`DROP TABLE \`safety_page_maintenance_facts\`;`)
  await db.run(sql`DROP TABLE \`safety_page\`;`)
  await db.run(sql`DROP TABLE \`_safety_page_v_version_operator_facts\`;`)
  await db.run(sql`DROP TABLE \`_safety_page_v_version_maintenance_facts\`;`)
  await db.run(sql`DROP TABLE \`_safety_page_v\`;`)
  await db.run(sql`DROP TABLE \`faq_page_groups_items_questions\`;`)
  await db.run(sql`DROP TABLE \`faq_page_groups_items\`;`)
  await db.run(sql`DROP TABLE \`faq_page\`;`)
  await db.run(sql`DROP TABLE \`_faq_page_v_version_groups_items_questions\`;`)
  await db.run(sql`DROP TABLE \`_faq_page_v_version_groups_items\`;`)
  await db.run(sql`DROP TABLE \`_faq_page_v\`;`)
  await db.run(sql`DROP TABLE \`legal_pages\`;`)
  await db.run(sql`DROP TABLE \`_legal_pages_v\`;`)
}
