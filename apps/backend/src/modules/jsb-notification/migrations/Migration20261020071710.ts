import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261020071710 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "jsb_notification" ("id" text not null, "type" text not null default 'order', "title" text not null, "message" text not null, "order_id" text null, "order_display_id" integer null, "customer_name" text null, "amount" integer null, "currency_code" text null, "is_read" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "jsb_notification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_jsb_notification_deleted_at" ON "jsb_notification" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "jsb_notification" cascade;`);
  }

}
