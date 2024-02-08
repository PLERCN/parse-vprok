import * as fs from 'node:fs/promises';

export const parse_product = async (page) => {
    let content = ""
    const info = await page.$(".OutOfStockInformer_informer__NCD7v");

    const name_product =  await page.$eval(".Title_title__nvodu", el => el.textContent)
    content += `${name_product}\n\n`

    const rating = await page.$eval(".Rating_value__S2QNR", el => el.textContent)
    const review_count = await page.$eval(".ActionsRow_reviews__AfSj_", el => el.textContent)

    if (info) {
       content += "Продукт недоступен для заказа в этом городе, поэтому цены нет!\n"
    } else {
        const find_old_price = await page.$('.PriceInfo_oldPrice__IW3mC')
        if (!find_old_price) {
            const price = await page.$eval(".Price_role_regular__X6X4D", el => el.textContent)
            content += `price=${parseInt(price)}\n`
        } else {
            const old_price = await page.$eval(".Price_role_old__r1uT1", el => el.textContent)
            const current_price = await page.$eval(".Price_role_discount__l_tpE", el => el.textContent);

            content += `price=${parseInt(current_price)}\n`
            content += `priceOld=${parseInt(old_price)}\n`
        }
    }

    content += `rating=${parseFloat(rating)}\n`
    content += `reviewCount=${parseInt(review_count)}`

    await fs.writeFile("product.txt", content)
        .catch(err => {
            console.log('Ошибка при записи в файл!')
        })
    console.log('Информация о продукте успешно записана в product.txt')
}