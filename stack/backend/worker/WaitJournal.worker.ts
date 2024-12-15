import fs from 'fs';
import Application from '../application/Application';
import { Journal, StatusJournal } from '../schema/entities/Journal.entity';
import BaseWorker from './Base.worker';
import path from 'path';
import { StatusQueueMediaFile } from '../schema/entities/QueueMediaFiles.entity';

class WaitJournalWorker extends BaseWorker {
  constructor(protected readonly application: Application) {
    super();
  }

  start() {
    console.log('Worker wait journal is started!');

    this.startJournal(StatusJournal.Preparation);

    setInterval(() => {
      this.startJournal(StatusJournal.WaitList);
      this.finishJournal();
      this.syncDownloadedQueueMediaFiles();
    }, 10_000);

    setInterval(() => {
      this.application.schema.updateJournalStatusFailedToWaitList();
    }, 10_000);
  }

  private async startJournal(status: StatusJournal) {
    const list = await this.application.schema.getJournals({
      where: {
        status,
      },
      options: {
        limit: 1
      },
    });

    for (const journal of list) {
      this.prepareWaitJournal(journal);
    }
  }

  private async finishJournal() {
    const list = await this.application.schema.getJournals({
      where: {
        status: { $ne: StatusJournal.Finished },
      },
      options: {},
    });

    for (const journal of list) {
      if (journal.totalCount > 0 &&  journal.progressCount > 0 && journal.totalCount === journal.progressCount) {
        await this.application.schema.upsertJournal({
          payload: {
            _id: journal._id,
          status: StatusJournal.Finished
          }
        });
      }
      
    }
  }


  private async syncDownloadedQueueMediaFiles() {
    const list = await this.application.schema.getJournals({
      where: {
        status: { $ne: StatusJournal.WaitList },
      },
      options: {},
    });

    for (const journal of list) {
      const progressCount = await this.getCountQueueMediaFiles(journal);

      await this.application.schema.upsertJournal({
        payload: {
          _id: journal._id,
          progressCount: progressCount,
        },
      });
    }
  }

  private async getCountQueueMediaFiles(journal: Journal) {
    const count = await this.application.schema.getCountQueueMediaFiles({
      where: {
        journal: journal._id,
        status: StatusQueueMediaFile.Downloaded,
      },
    });

    return count;
  }

  private getPathContent(i: number, url: string) {
    const safeTitle = this.reformatTitle(url);
    const dir = path.resolve(__dirname, `../../../content/${i}_${safeTitle}`);

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
            status: StatusQueueMediaFile.WaitList,
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
