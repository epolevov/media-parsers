import http from 'http';
import https from 'https';
import fs from 'fs';
import Application from '../application/Application';
import BaseWorker from './Base.worker';
import {
  QueueMediaFiles,
  StatusQueueMediaFile,
} from '../schema/entities/QueueMediaFiles.entity';

class QueueMediaFilesWorker extends BaseWorker {
  constructor(protected readonly application: Application) {
    super();
  }

  start() {
    console.log('Worker queue download media files is started!');

    setInterval(() => {
      this.startDownload();
    }, 1_000);
  }

  private async startDownload() {
    const list = await this.application.schema.getQueueMediaFiles({
      where: {
        status: StatusQueueMediaFile.WaitList,
      },
      options: {
        orderBy: { updatedAt: 'ASC' },
        limit: 3,
      },
    });

    for (const queueMediaFile of list) {
      this.download(queueMediaFile);
    }
  }

  private download(queueMediaFile: QueueMediaFiles) {
    const pathFile = `${queueMediaFile.path}/${queueMediaFile.index}.jpg`;

    const plugin = queueMediaFile.url.indexOf('https') > -1 ? https : http;

    plugin.get(queueMediaFile.url, (response) => {
      if (response.statusCode !== 200) {
        console.error(
          `🚫 An error occurred: the server returned a status ${response.statusCode}.`
        );

        this.application.schema.upsertQueueMediaFile({
          payload: {
            _id: queueMediaFile._id,
            status: StatusQueueMediaFile.Failed,
          },
        });

        return;
      }

      const file = fs.createWriteStream(pathFile);

      response.pipe(file);

      file.on('finish', () => {
        file.close();

        this.application.schema.upsertQueueMediaFile({
          payload: {
            _id: queueMediaFile._id,
            status: StatusQueueMediaFile.Downloaded,
          },
        });
      });

      file.on('error', (err) => {
        console.error(`🚫 Произошла ошибка сохранения файла.`, err);

        this.application.schema.upsertQueueMediaFile({
          payload: {
            _id: queueMediaFile._id,
            status: StatusQueueMediaFile.Failed,
          },
        });
      });
    });
  }
}

export default QueueMediaFilesWorker;
