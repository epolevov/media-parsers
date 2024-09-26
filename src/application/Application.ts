import Redis from 'ioredis';
import Schema from '../schema/Schema';
import WaitJournalWorker from '../worker/WaitJournal.worker';
import QueueMediaFilesWorker from '../worker/QueueMediaFiles.worker';

import Parser from '../parser/Parser';

class Application {
  public redis: Redis;
  public schema: Schema;
  public parser: Parser;
  public waitJournalWorker: WaitJournalWorker;
  public queueMediaFilesWorker: QueueMediaFilesWorker;
  public config = {
    redis: {
      host: process.env.REDIS_HOST,
    },
  };

  constructor() {
    this.redis = new Redis(this.config.redis.host);
    this.schema = new Schema(this);
    this.parser = new Parser(this);
    this.waitJournalWorker = new WaitJournalWorker(this);
    this.queueMediaFilesWorker = new QueueMediaFilesWorker(this);
  }

  async start() {
    console.log('Application is starter!');

    await this.schema.configure();

    this.waitJournalWorker.start();
    this.queueMediaFilesWorker.start();
  }
}

export default Application;
