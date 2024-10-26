import { Migration } from '@mikro-orm/migrations';

export class Migration20240908212749 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "journal" add constraint "journal_url_unique" unique ("url");');

    this.addSql('alter table "queue_media_files" add constraint "queue_media_files_url_unique" unique ("url");');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "journal" drop constraint "journal_url_unique";');

    this.addSql('alter table "queue_media_files" drop constraint "queue_media_files_url_unique";');
  }

}
