import path from 'path';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { Journal } from './schema/entities/Journal.entity';
import { QueueMediaFiles } from './schema/entities/QueueMediaFiles.entity';

const config: Options = {
  driver: PostgreSqlDriver,
  entities: [Journal, QueueMediaFiles],
  dbName: process.env.DB_NAME,
  clientUrl: process.env.DB_CLIENT_URL,
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: path.join(__dirname, './schema/migrations'),
    pathTs: path.join(__dirname, './schema/migrations'),
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: true, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
  },
  extensions: [Migrator],
};

export default config;
