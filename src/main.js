import puppeteer from 'puppeteer';
import {parse_product} from "./modules/ParseProduct.js";
import {sleep} from "./modules/sleep.js";
import inquirer from 'inquirer';
import {Regions} from "./models/Regions.js";


(async () => {
  const qustions = await inquirer.prompt([
      {name: 'url', message: "Введите ссылку на продукт сайта vprok!"},
  ])

  if (!qustions.url.startsWith("https://www.vprok.ru/product/")) return console.log("Ссылка должна быть для сайта vprok на продукт!")
  await console.log("Ожидайте инструкций!")

  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.setViewport({
    height: 1920,
    width: 1080
  })

  await page.goto(qustions.url, {
    waitUntil: 'domcontentloaded',
    timeout: 0
  });

  const page_404 = await page.$(".xf-error-404");
  if (page_404) {
    console.log("Ссылка должна быть для сайта vprok на продукт!")
  } else {
    await Regions.set_region(page)
    await sleep(1000)

    await parse_product(page)
    await page.screenshot({path: "screenshot.png"})
  }

  await browser.close();

})();