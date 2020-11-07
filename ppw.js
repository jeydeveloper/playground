let puppeteer = require('puppeteer')
let cheerio = require('cheerio')

const EMAIL_SELECTOR = 'input[type="text"]';
const PASSWORD_SELECTOR = 'input[type="password"]';
const SUBMIT_SELECTOR = '.btn-signup';
const LOGIN_URL = 'https://www.payperwatch.com/login';

const WAITING_TIME = 2000;

(() => {
  const clickImage = async (page) => {
    const listMusicPlay = await page.$$("div.musicplay");
    for (let indexMusicPlay = 0; indexMusicPlay < 3; indexMusicPlay++) {
      if (listMusicPlay[indexMusicPlay]) {
        console.log("Click image", indexMusicPlay);
        await Promise.all([
          await page.evaluate(element => {
            element.click();
          }, listMusicPlay[indexMusicPlay]),
          await page.waitForSelector('#musiclose', {
            visible: true,
          }),
          await page.waitFor(WAITING_TIME)
        ]);
        const listMusicClose = await page.$$("span#musiclose");
        const indexMusicClose = 0;
        if (listMusicClose[indexMusicClose]) {
          console.log("Click button close", indexMusicPlay);
          await Promise.all([
            await page.evaluate(element => {
              element.click();
            }, listMusicClose[indexMusicClose]),
            await page.waitFor(WAITING_TIME)
          ]);
          console.log('Done click button close', indexMusicPlay)
        }
        console.log('Done click image', indexMusicPlay)
        await page.waitFor(WAITING_TIME)
      }
    }
  };

  puppeteer.launch({ headless: true })
    .then(async (browser) => {
      let page = await browser.newPage()
      page.setViewport({ width: 1366, height: 768 });
      await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' })
      await page.waitFor('input[type="text"]');
      await page.click(EMAIL_SELECTOR)
      await page.keyboard.type('username');
      await page.click(PASSWORD_SELECTOR);
      await page.keyboard.type('password');
      await page.click(SUBMIT_SELECTOR);
      await page.waitFor('.hpt-name');
      const content = page.content();
      content
        .then(async (success) => {
          const $ = cheerio.load(success)
          const textExtracted = $('.hpt-name').text();
          if (textExtracted !== undefined) {
            await page.waitFor('.detrow');
            const links = await page.$$("ul.detrow > li > a");
            const index = 2;
            if (links[index]) {
              console.log("Clicking Menu", index);
              await Promise.all([
                await page.evaluate(element => {
                  element.click();
                }, links[index]),
                await page.waitForSelector('.musicplay', {
                  visible: true,
                }),
                await page.waitFor(WAITING_TIME)
              ]);
              try {
                await clickImage(page);
              } catch (err) {
                console.log(err)
              }
              console.log('test done')
            }
            console.log('ok')
          } else {
            console.log("Unable to fetch results. Please try again!")
          }
          browser.close()
        }).catch(err => console.log(err))
    })
    .catch((err) => {
      console.log(" CAUGHT WITH AN ERROR ", err);
    })
})()