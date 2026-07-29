import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`safety_page_operator_facts\`;`)
  await db.run(sql`DROP TABLE \`safety_page_maintenance_facts\`;`)
  await db.run(sql`DROP TABLE \`safety_page\`;`)
  await db.run(sql`DROP TABLE \`_safety_page_v_version_operator_facts\`;`)
  await db.run(sql`DROP TABLE \`_safety_page_v_version_maintenance_facts\`;`)
  await db.run(sql`DROP TABLE \`_safety_page_v\`;`)
}
