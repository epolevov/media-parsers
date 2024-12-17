import { Builder, By } from 'selenium-webdriver';
import { DriverInteface } from './Driver.interface';

class CollectionHermitageRuDriver implements DriverInteface {
  async getMediaFiles(url: string, result = [], totalCount = 0, index = 0) {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(/* ... */)
      .build();

    try {
      await driver.get(this.reformatUrl(url, index));

      // Timeout
      await driver.wait(new Promise((res) => setTimeout(res, 5000)), 5000);

      let elTotalCount = await driver
        .findElement(
          By.xpath(
            '/html/body/app-root/div/iss-entity-page/div/div[2]/div[2]/div/span[2]'
          )
        )
        .getAttribute('innerText');

      totalCount = Number(elTotalCount);

      while (true) {
        // Get src
        let src;

        src = await driver
          .findElement(
            By.xpath(
              '/html/body/app-root/div/iss-entity-page/div/div[4]/iss-media-gallery/div[1]/div/div/iss-image/img'
            )
          )
          .getAttribute('src');

        src = this.reformatSrc(src);

        // Get title
        let title = '';

        try {
          title = await driver
            .findElement(
              By.xpath(
                '/html/body/app-root/div/iss-entity-page/div/div[3]/span'
              )
            )
            .getText();

          title = this.reformatTitle(title);
        } catch (err) {
          console.log('Failed get title:', err)
        }

        try {
          // Behavior navigate
          if (index === 0) {
            try {
              await driver
                .findElement(
                  By.xpath(
                    '/html/body/app-root/div/iss-entity-page/div/a[2]/div[1]'
                  )
                )
                .click();
            } catch {}
          } else {
            try {
              await driver
                .findElement(
                  By.xpath(
                    '/html/body/app-root/div/iss-entity-page/div/a[3]/div[1]'
                  )
                )
                .click();
              } catch {}
          }

          result.push({ title, src });   
        } catch (err) {
          console.log('Debug Error:', err)
        }

        // console.log(index, src);

        index++;

        // Timeout
        await driver.wait(new Promise((res) => setTimeout(res, 1000)), 1000);

        if (index >= totalCount) {
          console.log('Breaked parse');
          break;
        }
      }
    } catch (err) {
      console.log('Failed parse page', index, err);

      throw Error('Failed get media files');
    } finally {
      await driver.quit();

      if (index >= totalCount) {
        console.log(`Finished parse ${index} of ${totalCount} items elements!`);

        return result;
      } else {
        // console.log('Aborted! Continue parse...');

        return await this.getMediaFiles(url, result, totalCount, index);
      }
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
      .substring(0, 150);
  }

  private reformatUrl(url: string, index: number) {
    url = url.replace('&index=0', '');

    return url + '&index=' + index;
  }
}

export default CollectionHermitageRuDriver;
