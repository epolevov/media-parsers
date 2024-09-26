import {
  EntityManager,
  FilterQuery,
  FindOptions,
  MikroORM,
  wrap,
} from '@mikro-orm/core';
import Application from 'application/Application';

import config from '../mikro-orm.config';
import { Journal } from './entities/Journal.entity';
import { QueueMediaFiles } from './entities/QueueMediaFiles.entity';

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
  }) {
    const em = parentEm || this.orm.em.fork();

    const data = await em.find(Journal, where, options);

    return data;
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
}

export default Schema;
