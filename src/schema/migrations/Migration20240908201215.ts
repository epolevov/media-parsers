import { Migration } from '@mikro-orm/migrations';

export class Migration20240908201215 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "journal" add column "status" text check ("status" in (\'wait-list\', \'preparation\', \'in-progress\', \'failed\', \'finished\')) not null default \'wait-list\';');
    this.addSql('alter table "journal" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "journal" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "journal" alter column "updated_at" type date using ("updated_at"::date);');
    this.addSql('alter table "journal" alter column "updated_at" set default \'NOW()\';');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "journal" alter column "created_at" drop default;');
    this.addSql('alter table "journal" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "journal" alter column "updated_at" drop default;');
    this.addSql('alter table "journal" alter column "updated_at" type date using ("updated_at"::date);');
  }

}
