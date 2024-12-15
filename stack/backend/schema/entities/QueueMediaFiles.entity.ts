import {
  Entity,
  Enum,
  EnumType,
  IntegerType,
  ManyToOne,
  Property,
  StringType,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Journal } from './Journal.entity';

export enum StatusQueueMediaFile {
  WaitList = 'wait-list',
  InProgress = 'in-progress',
  Failed = 'failed',
  Downloaded = 'downloaded',
}

@Entity()
@Unique({ properties: ['url'] })
export class QueueMediaFiles extends BaseEntity {
  @ManyToOne(() => Journal)
  journal!: Journal;

  @Property({ columnType: 'text' })
  url!: string;

  @Property({ type: StringType, columnType: 'text', nullable: true })
  path?: string;

  @Enum({
    type: EnumType,
    items: () => StatusQueueMediaFile,
    default: StatusQueueMediaFile.WaitList,
  })
  status?: StatusQueueMediaFile = StatusQueueMediaFile.WaitList;

  @Property({ type: StringType })
  index?: string = '0';

  @Property({ type: IntegerType })
  totalCount?: number = 0;
}
