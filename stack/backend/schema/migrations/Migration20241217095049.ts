import { Migration } from '@mikro-orm/migrations';

export class Migration20241217095049 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "queue_media_files" alter column "index" type varchar(260) using ("index"::varchar(260));');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "queue_media_files" alter column "index" type varchar(255) using ("index"::varchar(255));');
  }

}
