import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`home_page_services_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`tag\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_services_cards_order_idx\` ON \`home_page_services_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_services_cards_parent_id_idx\` ON \`home_page_services_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_services_cards_image_idx\` ON \`home_page_services_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_services_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_href\` text,
  	\`tag\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_services_cards_order_idx\` ON \`_home_page_v_version_services_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_services_cards_parent_id_idx\` ON \`_home_page_v_version_services_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_services_cards_image_idx\` ON \`_home_page_v_version_services_cards\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`services_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`services_heading\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`services_intro\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_services_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_services_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_services_intro\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`home_page_services_cards\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_services_cards\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`services_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`services_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`services_intro\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_services_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_services_heading\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_services_intro\`;`)
}
