import { Builder, By } from 'selenium-webdriver';
import { DriverInteface } from './Driver.interface';

class ElibShplRuDriver implements DriverInteface {
  reformatPhotoId(photoId) {
    return Number(photoId.replace(/[^0-9]/gi, ''));
  }

  async getMediaFiles(url: string) {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(/* ... */)
      .build();

    const result = [];

    try {
      await driver.get(url);

      // full mode
      await driver
        .findElement(By.xpath('//*/div[3]/div/div[1]/div[1]/div[1]/a[3]'))
        .click();

      await driver.wait(new Promise((res) => setTimeout(res, 50)), 50);

      const elements = await driver.findElements(
        By.css(
          'div > div.galery > div > div.dv-viewport-outer > div.dv-viewport > div > div.dv-page'
        )
      );

      console.log(`🔎 Parsed ${elements.length} media files in ${url}...`);

      let ii = 1;

      for (const element of elements) {
        let photoId = await element.getAttribute('class');
        photoId = this.reformatPhotoId(photoId);

        const photoUrl = `http://elib.shpl.ru/pages/${photoId}/zooms/8`;

        result.push({ title: '', src: photoUrl });

        ii++;
      }
    } finally {
      await driver.quit();
      return result;
    }
  }
}

export default ElibShplRuDriver;
