import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`home_page_marketplace_jet_visuals\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_marketplace_jet_visuals\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`marketplace_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`marketplace_heading\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`marketplace_intro\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_marketplace_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_marketplace_heading\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` DROP COLUMN \`version_marketplace_intro\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`home_page_marketplace_jet_visuals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`aircraft\` text,
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
  await db.run(sql`CREATE TABLE \`_home_page_v_version_marketplace_jet_visuals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`aircraft\` text,
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
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`marketplace_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`marketplace_heading\` text;`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`marketplace_intro\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_marketplace_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_marketplace_heading\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v\` ADD \`version_marketplace_intro\` text;`)
}
