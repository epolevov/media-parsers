import {
  EntityManager,
  FilterQuery,
  FindOptions,
  MikroORM,
  wrap,
} from '@mikro-orm/core';
import Application from 'application/Application';

import config from '../mikro-orm.config';
import { Journal, StatusJournal } from './entities/Journal.entity';
import {
  QueueMediaFiles,
  StatusQueueMediaFile,
} from './entities/QueueMediaFiles.entity';

class Schema {
  public orm: MikroORM;

  constructor(protected application: Application) {}

  async configure() {
    this.orm = await MikroORM.init(config);
  }

  async getQueueMediaFiles({
    where,
    options,
    parentEm = null,
  }: {
    where: FilterQuery<any>;
    options: FindOptions<any>;
    parentEm?: EntityManager;
  }) {
    const em = parentEm || this.orm.em.fork();

    const data = await em.find(QueueMediaFiles, where, options);

    return data;
  }

  async getJournals({
    where,
    options,
    parentEm = null,
  }: {
    where: FilterQuery<any>;
    options: FindOptions<any>;
    parentEm?: EntityManager;
  }): Promise<Journal[]> {
    const em = parentEm || this.orm.em.fork();

    const data = await em.find(Journal, where, options);

    return data;
  }

  async updateJournalStatusFailedToWaitList() {
    const em = this.orm.em.fork();

    // @ts-ignore
    const qb = em.createQueryBuilder(Journal);
    await qb
      .update({ status: StatusJournal.WaitList })
      .where({
        status: StatusJournal.Failed,
        errorMessage: '',
      })
      .execute();
  }

  async updateQueueMediaFilesStatusFailedToWaitList() {
    const em = this.orm.em.fork();

    // @ts-ignore
    const qb = em.createQueryBuilder(QueueMediaFiles);
    await qb
      .update({ status: StatusQueueMediaFile.WaitList })
      .where({
        status: StatusQueueMediaFile.Failed,
      })
      .execute();
  }

  async getJournal({ where = {}, requiredFail = true, parentEm = null }) {
    const em: EntityManager = parentEm || this.orm.em.fork();

    const data = await em[requiredFail ? 'findOneOrFail' : 'findOne'](
      Journal,
      where
    );

    return data;
  }

  async getQueueMediaFile({
    where = {},
    requiredFail = true,
    parentEm = null,
  }) {
    const em: EntityManager = parentEm || this.orm.em.fork();

    const data = await em[requiredFail ? 'findOneOrFail' : 'findOne'](
      QueueMediaFiles,
      where
    );

    return data;
  }

  async upsertJournal({ parentEm = null, payload }) {
    const em = parentEm || this.orm.em.fork();

    if (payload._id) {
      const existing = await this.getJournal({ where: { _id: payload._id } });

      const result = wrap(existing).assign(payload, {
        em,
        updateNestedEntities: true,
      });

      await em.persistAndFlush(result);

      return result;
    } else {
      const result = em.create(Journal, payload);
      await em.persistAndFlush(result);

      return result;
    }
  }

  async upsertQueueMediaFile({ parentEm = null, payload }) {
    const em = parentEm || this.orm.em.fork();

    if (payload._id) {
      const existing = await this.getQueueMediaFile({
        where: { _id: payload._id },
      });

      const result = wrap(existing).assign(payload, {
        em,
        updateNestedEntities: true,
      });

      await em.persistAndFlush(result);

      return result;
    } else {
      const result = em.create(QueueMediaFiles, payload);
      await em.persistAndFlush(result);

      return result;
    }
  }

  async getCountQueueMediaFiles({
    where = {},

    parentEm = null,
  }) {
    const em: EntityManager = parentEm || this.orm.em.fork();

    const count = await em.count(QueueMediaFiles, where);

    return count;
  }
}

export default Schema;
