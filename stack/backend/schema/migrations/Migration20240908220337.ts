import { Migration } from '@mikro-orm/migrations';

export class Migration20240908220337 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "queue_media_files" alter column "path" type text using ("path"::text);');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "queue_media_files" alter column "path" type varchar(255) using ("path"::varchar(255));');
  }

}
