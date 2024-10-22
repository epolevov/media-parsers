import {
  Entity,
  Enum,
  EnumType,
  IntegerType,
  Property,
  StringType,
  // StringType,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { FullTextType } from '@mikro-orm/postgresql';

export enum StatusJournal {
  WaitList = 'wait-list',
  Preparation = 'preparation',
  InProgress = 'in-progress',
  Failed = 'failed',
  Finished = 'finished',
}

@Entity()
@Unique({ properties: ['url'] })
export class Journal extends BaseEntity {
  @Property({ columnType: 'text' })
  url!: string;

  @Enum({
    type: EnumType,
    items: () => StatusJournal,
    default: StatusJournal.WaitList,
  })
  status?: StatusJournal = StatusJournal.WaitList;

  @Property({ type: StringType, length: 1000, nullable: true })
  errorMessage?: string;

  @Property({ type: IntegerType })
  totalCount?: number = 0;

  @Property({ type: IntegerType })
  progressCount?: number = 0;
}
