import { Migration } from '@mikro-orm/migrations';

export class Migration20240926160158 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "journal" add column "error_message" tsvector null;');
    this.addSql('alter table "journal" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "journal" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "journal" alter column "updated_at" type date using ("updated_at"::date);');
    this.addSql('alter table "journal" alter column "updated_at" set default \'NOW()\';');

    this.addSql('alter table "queue_media_files" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "queue_media_files" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "queue_media_files" alter column "updated_at" type date using ("updated_at"::date);');
    this.addSql('alter table "queue_media_files" alter column "updated_at" set default \'NOW()\';');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "journal" add column "path" varchar(255) null;');
    this.addSql('alter table "journal" alter column "created_at" type date(0) using ("created_at"::date(0));');
    this.addSql('alter table "journal" alter column "created_at" set default \'2024-09-08\';');
    this.addSql('alter table "journal" alter column "updated_at" type date(0) using ("updated_at"::date(0));');
    this.addSql('alter table "journal" alter column "updated_at" set default \'2024-09-08\';');

    this.addSql('alter table "queue_media_files" alter column "created_at" type date(0) using ("created_at"::date(0));');
    this.addSql('alter table "queue_media_files" alter column "created_at" set default \'2024-09-08\';');
    this.addSql('alter table "queue_media_files" alter column "updated_at" type date(0) using ("updated_at"::date(0));');
    this.addSql('alter table "queue_media_files" alter column "updated_at" set default \'2024-09-08\';');
  }

}
