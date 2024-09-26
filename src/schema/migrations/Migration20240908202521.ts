import { Migration } from '@mikro-orm/migrations';

export class Migration20240908202521 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "queue_media_files" ("_id" bigserial primary key, "created_at" date not null default \'NOW()\', "updated_at" date not null default \'NOW()\', "journal__id" bigint not null, "url" text not null, "status" text check ("status" in (\'wait-list\', \'in-progress\', \'failed\', \'downloaded\')) not null default \'wait-list\', "total_count" int not null default 0);');

    this.addSql('alter table "queue_media_files" add constraint "queue_media_files_journal__id_foreign" foreign key ("journal__id") references "journal" ("_id") on update cascade;');
  }

}
