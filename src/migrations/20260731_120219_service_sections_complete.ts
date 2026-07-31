import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`management_page_standards_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`management_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`management_page_standards_cards_order_idx\` ON \`management_page_standards_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`management_page_standards_cards_parent_id_idx\` ON \`management_page_standards_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_management_page_v_version_standards_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_management_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_standards_cards_order_idx\` ON \`_management_page_v_version_standards_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_standards_cards_parent_id_idx\` ON \`_management_page_v_version_standards_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`sales_page_intro_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`sales_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`sales_page_intro_paragraphs_order_idx\` ON \`sales_page_intro_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`sales_page_intro_paragraphs_parent_id_idx\` ON \`sales_page_intro_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`sales_page_services_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`sales_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`sales_page_services_chips_order_idx\` ON \`sales_page_services_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`sales_page_services_chips_parent_id_idx\` ON \`sales_page_services_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_sales_page_v_version_intro_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_sales_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_intro_paragraphs_order_idx\` ON \`_sales_page_v_version_intro_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_intro_paragraphs_parent_id_idx\` ON \`_sales_page_v_version_intro_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_sales_page_v_version_services_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_sales_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_services_chips_order_idx\` ON \`_sales_page_v_version_services_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_sales_page_v_version_services_chips_parent_id_idx\` ON \`_sales_page_v_version_services_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cargo_page_showcase_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cargo_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cargo_page_showcase_stats_order_idx\` ON \`cargo_page_showcase_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cargo_page_showcase_stats_parent_id_idx\` ON \`cargo_page_showcase_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_cargo_page_v_version_showcase_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cargo_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_showcase_stats_order_idx\` ON \`_cargo_page_v_version_showcase_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cargo_page_v_version_showcase_stats_parent_id_idx\` ON \`_cargo_page_v_version_showcase_stats\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`home_page_marketplace_jet_visuals\` ADD \`aircraft\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v_version_marketplace_jet_visuals\` ADD \`aircraft\` text;`)
  await db.run(sql`ALTER TABLE \`charter_page\` ADD \`hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`_charter_page_v\` ADD \`version_hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`management_page_showcase_cards\` ADD \`badge\` text;`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`standards_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`standards_heading\` text;`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`standards_intro\` text;`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`standards_heading_accent\` text;`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`standards_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`standards_figure_value\` text;`)
  await db.run(sql`ALTER TABLE \`management_page\` ADD \`standards_figure_label\` text;`)
  await db.run(sql`CREATE INDEX \`management_page_standards_standards_image_idx\` ON \`management_page\` (\`standards_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_management_page_v_version_showcase_cards\` ADD \`badge\` text;`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_standards_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_standards_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_standards_intro\` text;`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_standards_heading_accent\` text;`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_standards_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_standards_figure_value\` text;`)
  await db.run(sql`ALTER TABLE \`_management_page_v\` ADD \`version_standards_figure_label\` text;`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_standards_version_standards_i_idx\` ON \`_management_page_v\` (\`version_standards_image_id\`);`)
  await db.run(sql`ALTER TABLE \`sales_page_showcase_cards\` ADD \`badge\` text;`)
  await db.run(sql`ALTER TABLE \`sales_page_showcase_cards\` ADD \`icon\` text;`)
  await db.run(sql`ALTER TABLE \`sales_page\` ADD \`hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`sales_page\` ADD \`intro_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`sales_page\` ADD \`intro_heading\` text;`)
  await db.run(sql`ALTER TABLE \`sales_page\` ADD \`services_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`sales_page\` ADD \`services_heading\` text;`)
  await db.run(sql`ALTER TABLE \`sales_page\` ADD \`services_intro\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v_version_showcase_cards\` ADD \`badge\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v_version_showcase_cards\` ADD \`icon\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` ADD \`version_hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` ADD \`version_intro_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` ADD \`version_intro_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` ADD \`version_services_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` ADD \`version_services_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` ADD \`version_services_intro\` text;`)
  await db.run(sql`ALTER TABLE \`cargo_page_features_cards\` ADD \`featured\` integer;`)
  await db.run(sql`ALTER TABLE \`cargo_page_showcase_cards\` ADD \`badge\` text;`)
  await db.run(sql`ALTER TABLE \`cargo_page\` ADD \`hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`_cargo_page_v_version_features_cards\` ADD \`featured\` integer;`)
  await db.run(sql`ALTER TABLE \`_cargo_page_v_version_showcase_cards\` ADD \`badge\` text;`)
  await db.run(sql`ALTER TABLE \`_cargo_page_v\` ADD \`version_hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`mro_page\` ADD \`hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`mro_page\` ADD \`hero_body_secondary\` text;`)
  await db.run(sql`ALTER TABLE \`mro_page\` ADD \`hero_footnote\` text;`)
  await db.run(sql`ALTER TABLE \`_mro_page_v\` ADD \`version_hero_heading_rest\` text;`)
  await db.run(sql`ALTER TABLE \`_mro_page_v\` ADD \`version_hero_body_secondary\` text;`)
  await db.run(sql`ALTER TABLE \`_mro_page_v\` ADD \`version_hero_footnote\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`management_page_standards_cards\`;`)
  await db.run(sql`DROP TABLE \`_management_page_v_version_standards_cards\`;`)
  await db.run(sql`DROP TABLE \`sales_page_intro_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`sales_page_services_chips\`;`)
  await db.run(sql`DROP TABLE \`_sales_page_v_version_intro_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`_sales_page_v_version_services_chips\`;`)
  await db.run(sql`DROP TABLE \`cargo_page_showcase_stats\`;`)
  await db.run(sql`DROP TABLE \`_cargo_page_v_version_showcase_stats\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_management_page\` (
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
  await db.run(sql`INSERT INTO \`__new_management_page\`("id", "hero_eyebrow", "hero_heading", "hero_heading_accent", "hero_body", "hero_image_id", "hero_primary_label", "hero_primary_href", "hero_secondary_label", "hero_secondary_href", "features_eyebrow", "features_heading", "features_intro", "showcase_eyebrow", "showcase_heading", "showcase_intro", "_status", "updated_at", "created_at") SELECT "id", "hero_eyebrow", "hero_heading", "hero_heading_accent", "hero_body", "hero_image_id", "hero_primary_label", "hero_primary_href", "hero_secondary_label", "hero_secondary_href", "features_eyebrow", "features_heading", "features_intro", "showcase_eyebrow", "showcase_heading", "showcase_intro", "_status", "updated_at", "created_at" FROM \`management_page\`;`)
  await db.run(sql`DROP TABLE \`management_page\`;`)
  await db.run(sql`ALTER TABLE \`__new_management_page\` RENAME TO \`management_page\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`management_page_hero_hero_image_idx\` ON \`management_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`management_page__status_idx\` ON \`management_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__management_page_v\` (
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
  await db.run(sql`INSERT INTO \`__new__management_page_v\`("id", "version_hero_eyebrow", "version_hero_heading", "version_hero_heading_accent", "version_hero_body", "version_hero_image_id", "version_hero_primary_label", "version_hero_primary_href", "version_hero_secondary_label", "version_hero_secondary_href", "version_features_eyebrow", "version_features_heading", "version_features_intro", "version_showcase_eyebrow", "version_showcase_heading", "version_showcase_intro", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest", "autosave") SELECT "id", "version_hero_eyebrow", "version_hero_heading", "version_hero_heading_accent", "version_hero_body", "version_hero_image_id", "version_hero_primary_label", "version_hero_primary_href", "version_hero_secondary_label", "version_hero_secondary_href", "version_features_eyebrow", "version_features_heading", "version_features_intro", "version_showcase_eyebrow", "version_showcase_heading", "version_showcase_intro", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest", "autosave" FROM \`_management_page_v\`;`)
  await db.run(sql`DROP TABLE \`_management_page_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__management_page_v\` RENAME TO \`_management_page_v\`;`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_hero_version_hero_image_idx\` ON \`_management_page_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_version_version__status_idx\` ON \`_management_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_created_at_idx\` ON \`_management_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_updated_at_idx\` ON \`_management_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_latest_idx\` ON \`_management_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_management_page_v_autosave_idx\` ON \`_management_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`home_page_marketplace_jet_visuals\` DROP COLUMN \`aircraft\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v_version_marketplace_jet_visuals\` DROP COLUMN \`aircraft\`;`)
  await db.run(sql`ALTER TABLE \`charter_page\` DROP COLUMN \`hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`_charter_page_v\` DROP COLUMN \`version_hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`management_page_showcase_cards\` DROP COLUMN \`badge\`;`)
  await db.run(sql`ALTER TABLE \`_management_page_v_version_showcase_cards\` DROP COLUMN \`badge\`;`)
  await db.run(sql`ALTER TABLE \`sales_page_showcase_cards\` DROP COLUMN \`badge\`;`)
  await db.run(sql`ALTER TABLE \`sales_page_showcase_cards\` DROP COLUMN \`icon\`;`)
  await db.run(sql`ALTER TABLE \`sales_page\` DROP COLUMN \`hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`sales_page\` DROP COLUMN \`intro_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`sales_page\` DROP COLUMN \`intro_heading\`;`)
  await db.run(sql`ALTER TABLE \`sales_page\` DROP COLUMN \`services_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`sales_page\` DROP COLUMN \`services_heading\`;`)
  await db.run(sql`ALTER TABLE \`sales_page\` DROP COLUMN \`services_intro\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v_version_showcase_cards\` DROP COLUMN \`badge\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v_version_showcase_cards\` DROP COLUMN \`icon\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` DROP COLUMN \`version_hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` DROP COLUMN \`version_intro_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` DROP COLUMN \`version_intro_heading\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` DROP COLUMN \`version_services_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` DROP COLUMN \`version_services_heading\`;`)
  await db.run(sql`ALTER TABLE \`_sales_page_v\` DROP COLUMN \`version_services_intro\`;`)
  await db.run(sql`ALTER TABLE \`cargo_page_features_cards\` DROP COLUMN \`featured\`;`)
  await db.run(sql`ALTER TABLE \`cargo_page_showcase_cards\` DROP COLUMN \`badge\`;`)
  await db.run(sql`ALTER TABLE \`cargo_page\` DROP COLUMN \`hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`_cargo_page_v_version_features_cards\` DROP COLUMN \`featured\`;`)
  await db.run(sql`ALTER TABLE \`_cargo_page_v_version_showcase_cards\` DROP COLUMN \`badge\`;`)
  await db.run(sql`ALTER TABLE \`_cargo_page_v\` DROP COLUMN \`version_hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`mro_page\` DROP COLUMN \`hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`mro_page\` DROP COLUMN \`hero_body_secondary\`;`)
  await db.run(sql`ALTER TABLE \`mro_page\` DROP COLUMN \`hero_footnote\`;`)
  await db.run(sql`ALTER TABLE \`_mro_page_v\` DROP COLUMN \`version_hero_heading_rest\`;`)
  await db.run(sql`ALTER TABLE \`_mro_page_v\` DROP COLUMN \`version_hero_body_secondary\`;`)
  await db.run(sql`ALTER TABLE \`_mro_page_v\` DROP COLUMN \`version_hero_footnote\`;`)
}
