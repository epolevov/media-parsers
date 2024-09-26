import { BigIntType, DateType, PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ type: BigIntType, autoincrement: true })
  _id!: number;

  @Property({ type: DateType, default: 'NOW()' })
  createdAt = new Date();

  @Property({ type: DateType, onUpdate: () => new Date(), default: 'NOW()' })
  updatedAt = new Date();
}
