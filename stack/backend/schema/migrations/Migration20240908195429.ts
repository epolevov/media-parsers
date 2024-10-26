import { Migration } from '@mikro-orm/migrations';

export class Migration20240908195429 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "journal" ("_id" bigserial primary key, "created_at" date not null, "updated_at" date not null, "url" text not null);');
  }

}
