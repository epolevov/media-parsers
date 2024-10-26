import Application from '../application/Application';
import CollectionHermitageRuDriver from './drivers/Collection.hermitage.ru.driver';
import ElibShplRuDriver from './drivers/Elib.shpl.ru.driver';

export type DriverType = 'elib.shpl.ru' | 'collections.hermitage.ru';

class Parser {
  constructor(protected readonly application: Application) {}

  private getDriver(url: string) {
    if (url.indexOf('elib.shpl.ru') > -1) return new ElibShplRuDriver();
    if (url.indexOf('collections.hermitage.ru') > -1)
      return new CollectionHermitageRuDriver();

    return null;
  }

  async getMediaFiles(url: string) {
    const driver = this.getDriver(url);

    return await driver.getMediaFiles(url);
  }
}

export default Parser;
