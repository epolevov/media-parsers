import { Builder, By } from 'selenium-webdriver';
import { DriverInteface } from './Driver.interface';

class CollectionHermitageRuDriver implements DriverInteface {
  async getMediaFiles(url: string) {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(/* ... */)
      .build();

    const result = [];

    try {
      await driver.get(url);

      let index = 0;

      while (true) {
        // Get src
        let src;

        src = await driver
          .findElement(
            By.xpath(
              '/html/body/app-root/div/iss-entity-page/div/div[4]/iss-entity-gallery/div[1]/div/div/iss-image/img'
            )
          )
          .getAttribute('src');

        src = this.reformatSrc(src);

        // Get title
        let title = await driver
          .findElement(
            By.xpath(
              '/html/body/app-root/div/iss-entity-page/div/div[4]/iss-entity-detailed-info/div[1]/span'
            )
          )
          .getText();
        title = this.reformatTitle(title);

        // Behavior navigate
        if (index === 0) {
          await driver
            .findElement(
              By.xpath(
                ' /html/body/app-root/div/iss-entity-page/div/a[2]/div[1]'
              )
            )
            .click();
        } else {
          await driver
            .findElement(
              By.xpath(
                '/html/body/app-root/div/iss-entity-page/div/a[3]/div[1]'
              )
            )
            .click();
        }

        // If no src, then exit
        // if (!src) break;

        result.push(src);

        // Timeout
        await driver.wait(new Promise((res) => setTimeout(res, 200)), 200);
      }
    } catch {
      throw Error('Failed get media files');
    } finally {
      await driver.quit();
      return result;
    }
  }

  private reformatSrc(src) {
    let result = src;

    result = result.replace('.webp', '.jpg');
    result = result.replace('w=1000', 'w=1000000');
    result = result.replace('h=1000', 'h=1000000');

    return result;
  }

  private reformatTitle(title) {
    return title
      .replace(/[^а-яА-яA-Za-z0-9]/gi, '_')
      .replace(/__/gi, '_')
      .toLowerCase()
      .substring(0, 50);
  }
}

export default CollectionHermitageRuDriver;
