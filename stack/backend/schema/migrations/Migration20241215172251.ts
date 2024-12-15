import { Migration } from '@mikro-orm/migrations';

export class Migration20241215172251 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "queue_media_files" alter column "index" type varchar(255) using ("index"::varchar(255));');
    this.addSql('alter table "queue_media_files" alter column "index" set default \'0\';');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "queue_media_files" alter column "index" type int using ("index"::int);');
    this.addSql('alter table "queue_media_files" alter column "index" set default 0;');
  }

}
