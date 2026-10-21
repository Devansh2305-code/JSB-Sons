import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261020072359 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "jsb_notification" add column if not exists "raw_amount" jsonb null;`);
    this.addSql(`alter table if exists "jsb_notification" alter column "amount" type numeric using ("amount"::numeric);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "jsb_notification" drop column if exists "raw_amount";`);

    this.addSql(`alter table if exists "jsb_notification" alter column "amount" type integer using ("amount"::integer);`);
  }

}
