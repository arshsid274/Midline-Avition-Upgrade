import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`faq_page_groups_items_questions\`;`)
  await db.run(sql`DROP TABLE \`faq_page_groups_items\`;`)
  await db.run(sql`DROP TABLE \`faq_page\`;`)
  await db.run(sql`DROP TABLE \`_faq_page_v_version_groups_items_questions\`;`)
  await db.run(sql`DROP TABLE \`_faq_page_v_version_groups_items\`;`)
  await db.run(sql`DROP TABLE \`_faq_page_v\`;`)
}
