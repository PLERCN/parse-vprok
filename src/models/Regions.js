import inquirer from "inquirer";

export class Regions {
    static all_regions = []

    static fetch_regions = async (page) => {
        await page.click(`.UiHeaderHorizontalBase_region__2ODCG`);

        const regions_lis = await page.$$('#__next > ' +
            'div.Modal_root__kPoVQ.Modal_open__PaUmT > div > div > ' +
            'div.UiRegionListBase_root__Z4_yT > div.UiRegionListBase_listWrapper__Iqbd5 > ul li')

        this.regions_lis = regions_lis

        for (let region of regions_lis) {
            this.all_regions.push(await page.evaluate(el => el.textContent, region))
        }
    }

    static set_region = async (page) => {
        await this.fetch_regions(page)

        const question = await inquirer.prompt([
            {type: "list", name: "region", message: "Выберите регион:", choices: this.all_regions}
        ])

        const number_region = this.all_regions.findIndex(el => el == question.region)
        await this.regions_lis[number_region].click()
    }
}