import { Migration } from '@mikro-orm/migrations';

export class Migration20240908212649 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "queue_media_files" add column "index" int not null default 0;');
  }

}
