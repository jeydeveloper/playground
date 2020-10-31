let puppeteer = require('puppeteer')
let cheerio = require('cheerio')

const EMAIL_SELECTOR = 'input[type="text"]';
const PASSWORD_SELECTOR = 'input[type="password"]';
const SUBMIT_SELECTOR = '.btn-signup';
const LOGIN_URL = 'https://www.payperwatch.com/login';

// if (process.argv[2] !== undefined) {
(() => {
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
                await page.waitFor(2000)
              ]);
              const links2 = await page.$$("div.musicplay");
              let index2 = 1;
              if (links2[index2]) {
                console.log("Clicking Image", index2);
                await Promise.all([
                  await page.evaluate(element => {
                    element.click();
                  }, links2[index2]),
                  await page.waitForSelector('#musiclose', {
                    visible: true,
                  }),
                  await page.waitFor(2000)
                ]);
                const links3 = await page.$$("span#musiclose");
                const index3 = 0;
                if (links3[index3]) {
                  console.log("Clicking Button Close", index3);
                  await Promise.all([
                    await page.evaluate(element => {
                      element.click();
                    }, links3[index3]),
                    await page.waitFor(2000)
                  ]);
                  console.log('test button close')
                }
                console.log('test click image 1')
              }
              index2++;
              await page.waitFor(2000)
              if (links2[index2]) {
                console.log("Clicking Image", index2);
                await Promise.all([
                  await page.evaluate(element => {
                    element.click();
                  }, links2[index2]),
                  await page.waitForSelector('#musiclose', {
                    visible: true,
                  }),
                  await page.waitFor(2000)
                ]);
                const links3 = await page.$$("span#musiclose");
                const index3 = 0;
                if (links3[index3]) {
                  console.log("Clicking Button Close", index3);
                  await Promise.all([
                    await page.evaluate(element => {
                      element.click();
                    }, links3[index3]),
                    await page.waitFor(2000)
                  ]);
                  console.log('test button close')
                }
                console.log('test click image 2')
              }
              index2++;
              await page.waitFor(2000)
              if (links2[index2]) {
                console.log("Clicking Image", index2);
                await Promise.all([
                  await page.evaluate(element => {
                    element.click();
                  }, links2[index2]),
                  await page.waitForSelector('#musiclose', {
                    visible: true,
                  }),
                  await page.waitFor(2000)
                ]);
                const links3 = await page.$$("span#musiclose");
                const index3 = 0;
                if (links3[index3]) {
                  console.log("Clicking Button Close", index3);
                  await Promise.all([
                    await page.evaluate(element => {
                      element.click();
                    }, links3[index3]),
                    await page.waitFor(2000)
                  ]);
                  console.log('test button close')
                }
                console.log('test click image 3')
              }
              console.log('test done')
            }
            console.log('ok')
          } else {
            console.log("Unable to fetch results. Please try again!")
          }
        }).catch(err => console.log(err))
    })
    .catch((err) => {
      console.log(" CAUGHT WITH AN ERROR ", err);
    })
})()
// }
