import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  	\`video_url\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_fleet_cards_order_idx\` ON \`home_page_fleet_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_fleet_cards_parent_id_idx\` ON \`home_page_fleet_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_fleet_cards_image_idx\` ON \`home_page_fleet_cards\` (\`image_id\`);`)
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
  	\`video_url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_fleet_cards_order_idx\` ON \`_home_page_v_version_fleet_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_fleet_cards_parent_id_idx\` ON \`_home_page_v_version_fleet_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_fleet_cards_image_idx\` ON \`_home_page_v_version_fleet_cards\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`showcase_heading\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`destinations_heading\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`destinations_intro\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`marketplace_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`marketplace_heading\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`marketplace_intro\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`accreditations_heading\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`fleet_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`fleet_heading\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`fleet_intro\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_showcase_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_destinations_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_destinations_intro\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_marketplace_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_marketplace_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_marketplace_intro\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_accreditations_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_fleet_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_fleet_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_fleet_intro\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`home_page_showcase_panels\`;`)
  await db.run(sql`DROP TABLE \`home_page_destinations_cards\`;`)
  await db.run(sql`DROP TABLE \`home_page_marketplace_jet_visuals\`;`)
  await db.run(sql`DROP TABLE \`home_page_fleet_cards\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_showcase_panels\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_destinations_cards\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_marketplace_jet_visuals\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_fleet_cards\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`showcase_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`destinations_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`destinations_intro\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`marketplace_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`marketplace_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`marketplace_intro\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`accreditations_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`fleet_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`fleet_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`fleet_intro\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_showcase_heading\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_destinations_heading\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_destinations_intro\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_marketplace_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_marketplace_heading\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_marketplace_intro\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_accreditations_heading\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_fleet_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_fleet_heading\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_fleet_intro\`;`)
}
