import axios from 'axios';
import Application from '../application/Application';
import BaseWorker from './Base.worker';
import { StatusJournal } from '../schema/entities/Journal.entity';

class EmdSyncWorker extends BaseWorker {
  private apitoken = 'e44e417eca5907a8fe7fbdc947921440';
  private endpoint = 'https://api.emd.one/api/app-4ddbefee';

  constructor(protected readonly application: Application) {
    super();
  }

  start() {
    console.log('Worker EMD Sync is started!');

    setInterval(() => {
      this.syncToLocal();
    }, 10_000);

    setInterval(() => {
      this.syncToCloud();
    }, 20_000);
  }

  private async syncToLocal() {
    try {
      const list = await axios.post(
        this.endpoint + '/database/journal/row',
        {
          query: {
            ['data.status']: 'wait-list',
          },
        },
        {
          headers: {
            apitoken: this.apitoken,
          },
        }
      );

      const rows = list.data.data;

      for (const row of rows) {
        const item = await this.application.schema.getJournal({
          where: {
            url: row.data.url,
          },
          requiredFail: false,
        });

        if (!item) {
          await this.application.schema.upsertJournal({
            payload: {
              url: row.data.url,
              emdRowId: row._id,
            },
          });

          console.log(`New request "${row.data.url}" is saved!`);
        } else {
          await this.application.schema.upsertJournal({
            payload: {
              _id: item._id,
              status: StatusJournal.WaitList,
              emdRowId: row._id,
            },
          });
        }
      }
    } catch (err) {
      console.log('Failed sync to local', err);
    }
  }

  private async syncToCloud() {
    try {
      const journals = await this.application.schema.getJournals({
        where: {
          status: { $ne: StatusJournal.WaitList },
        },
        options: {},
      });

      for (const journal of journals) {
        await axios.put(
          this.endpoint + '/database/journal/row',
          {
            _id: journal.emdRowId,
            data: {
              status: journal.status,
              total_count: journal.totalCount,
              progress_count: journal.progressCount,
              raw: journal,
            },
          },
          {
            headers: {
              apitoken: this.apitoken,
            },
          }
        );
      }
    } catch (err) {
      console.log('Failed sync to cloud', err);
    }
  }
}

export default EmdSyncWorker;
