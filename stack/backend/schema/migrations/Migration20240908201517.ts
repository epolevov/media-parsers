import { Migration } from '@mikro-orm/migrations';

export class Migration20240908201517 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "journal" add column "total_count" int not null default 0, add column "progress_count" int not null default 0;');
  }

}
