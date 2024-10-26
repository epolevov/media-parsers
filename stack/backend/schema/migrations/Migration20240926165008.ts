import { Migration } from '@mikro-orm/migrations';

export class Migration20240926165008 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "journal" alter column "error_message" type varchar(1000) using ("error_message"::varchar(1000));');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "journal" alter column "error_message" type tsvector using ("error_message"::tsvector);');
  }

}
