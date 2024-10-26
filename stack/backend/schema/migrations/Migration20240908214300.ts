import { Migration } from '@mikro-orm/migrations';

export class Migration20240908214300 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "queue_media_files" add column "path" varchar(255) null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "journal" add column "path" varchar(255) null;');
  }

}
