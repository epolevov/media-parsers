import { Migration } from '@mikro-orm/migrations';

export class Migration20241026100639 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "journal" add column "emd_row_id" varchar(255) not null;');
  }

}
