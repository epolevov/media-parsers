import fs from 'fs';
import Application from '../application/Application';
import { Journal, StatusJournal } from '../schema/entities/Journal.entity';
import BaseWorker from './Base.worker';
import path from 'path';

class WaitJournalWorker extends BaseWorker {
  constructor(protected readonly application: Application) {
    super();
  }

  start() {
    console.log('Worker wait journal is started!');

    setInterval(() => {
      this.startWaitJournal();
    }, 10_000);
  }

  private async startWaitJournal() {
    const list = await this.application.schema.getJournals({
      where: {
        status: StatusJournal.WaitList,
      },
      options: {},
    });

    for (const journal of list) {
      this.prepareWaitJournal(journal);
    }
  }

  private getPathContent(i: number, url: string) {
    const safeTitle = this.reformatTitle(url);
    const dir = path.resolve(`../content/${i}_${safeTitle}`);

    return dir;
  }

  private reformatTitle(title) {
    return title
      .replace(/[^а-яА-яA-Za-z0-9]/gi, '_')
      .replace(/__/gi, '_')
      .toLowerCase()
      .substring(0, 50);
  }

  private paddingNumber(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }

    return str;
  }

  private async prepareWaitJournal(journal: Journal) {
    await this.application.schema.upsertJournal({
      payload: { _id: journal._id, status: StatusJournal.Preparation },
    });

    const em = this.application.schema.orm.em.fork();

    await em.begin();

    try {
      const pathDir = this.getPathContent(journal._id, journal.url);
      if (!fs.existsSync(pathDir)) fs.mkdirSync(pathDir);

      const mediaFiles = await this.application.parser.getMediaFiles(
        journal.url
      );

      let ii = 1;

      for (const mediaFile of mediaFiles) {
        await this.application.schema.upsertQueueMediaFile({
          payload: {
            journal: journal._id,
            url: mediaFile,
            index: this.paddingNumber(ii, 4),
            path: pathDir,
          },
          parentEm: em,
        });
        ii++;
      }

      if (mediaFiles.length > 0) {
        await this.application.schema.upsertJournal({
          payload: {
            _id: journal._id,
            status: StatusJournal.InProgress,
            totalCount: mediaFiles.length,
            path: pathDir,
          },
          parentEm: em,
        });
      }

      await em.commit();
    } catch (e) {
      await em.rollback();

      await this.application.schema.upsertJournal({
        payload: {
          _id: journal._id,
          status: StatusJournal.Failed,
          errorMessage: e.message,
        },
      });
    }
  }
}

export default WaitJournalWorker;
