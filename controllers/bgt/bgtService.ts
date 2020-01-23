import mongoose, { ModelOptions } from 'mongoose'
import puppeteer, { Browser } from 'puppeteer'
import https from 'https'
import cheerio from 'cheerio'
import * as model from '../../environment/productModel'
import * as helper from '../../environment/helper'
import { httpify } from 'caseless';
import { isNullOrUndefined } from 'util';
import { resolve } from 'path';
import { timingSafeEqual } from 'crypto';

class bgtServices {

    async getNodes(pageContent: any) {
        return new Promise(async (resolve, reject) => {
            let $ = cheerio.load(pageContent)
            var nodes: any = {}

            nodes.nodePrice = $("div.area-preco div[class='area-bloco-preco bloco-preco text-danger fs-20 font-weight-bold pr-0']")
            nodes.nodeUn = $("div[class='area-bloco-tag fs-11 align-self-center text-right'] a span[class='badge-mob badge badge-prd p-1 badge-light text-muted']")
            nodes.nodeProduct = $("div[class='area-title-brand-txt-desc ie-row-paddingr'] h2")
            nodes.nodeOnline = $('div.list-product-item span.regra-prd')

            resolve(nodes)
        })
    }

    async scrollToBottom(page: puppeteer.Page) {
        return new Promise(async (resolve, reject) => {
            const distance = 200; // should be less than or equal to window.innerHeight
            const delay = 100;
            while (await page.evaluate(() => (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight))) {
                await page.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
                await page.waitFor(delay);
            }
            resolve()
        })
    }

    private getPromotionals(pageContent: any) {
        return new Promise(async (resolve, reject) => {

            await model.productModel.deleteMany({ promotion: true })

            var arrayProducts: any = await this.scrapePage(pageContent)

            arrayProducts.forEach(async (item: any) => {
                item.promotion = true
                item.category = mongoose.Types.ObjectId("5d2b3765753423bec9a6446f")  //Promoções

                await item.save()
            })

            console.log("/promocoes --> OK  [" + arrayProducts.length + "]")

            resolve()
        })
    }

        return new Promise(async (resolve, reject) => {

            //await model.productModel.deleteMany({promotion: true})

            let array: any[] = []
            let nodes: any = await this.getNodes(pageContent)

            let arrayPrices: any[] = []
            let arrayProducts: any[] = []
            let arrayUns: any[] = []
            let arrayOnline: any[] = []

            let nodePrice: Cheerio = nodes.nodePrice
            let nodeUn: Cheerio = nodes.nodeUn
            let nodeProduct: Cheerio = nodes.nodeProduct
            let nodeOnline: Cheerio = nodes.nodeOnline

            nodeOnline.each((i, element) => {
                element.children.forEach(item => {
                    if (item.type == 'tag' && item.name == 'span') {
                        let temp = helper.especialCharMask(item.children[0].data || '')

                        if (!isNullOrUndefined(temp) && (temp != '')) {
                            arrayOnline.push({ index: i, item: temp })
                        }
                    }
                })
            })

            nodeProduct.each((i, element) => {
                arrayProducts.push(element.children[0].data)
            })

            nodePrice.each((i, element) => {
                element.children.forEach(item => {
                    if (item.type == 'text') {
                        let temp: any = helper.especialCharMask(item.data || '')

                        if (!isNullOrUndefined(temp) && (temp != '')) {
                            arrayPrices.push(temp.replace(',', '.'))
                        }

                    }
                })
            })

            nodeUn.each((i, element) => {
                element.children.forEach(item => {
                    if (item.type == 'text') {
                        let temp = helper.especialCharMask(item.data || '')

                        if (!isNullOrUndefined(temp) && (temp != '')) {
                            arrayUns.push(temp)
                        }
                    }
                })
            })

            for (let i = 0; i < arrayProducts.length; i++) {
                var produto: model.IProduct = new model.productModel()

                produto.product = arrayProducts[i]
                produto.price = arrayPrices[i]
                produto.UN = arrayUns[i]
                produto.market = mongoose.Types.ObjectId("5d2cfc35753423bec9a6467a")    //Bigatti

                if (!isNullOrUndefined(arrayOnline[i])) {
                    if (!isNullOrUndefined(arrayOnline[i].item)) {
                        produto.onlineShop = true
                    }

                }

                array.push(produto)
            }

            resolve(array)
        }).catch(error => {
            console.log(error)
        })
    }

    async scrape() {
        return new Promise(async (resolve, reject) => {

            const baseUrl: string = "https://www.sitemercado.com.br/bigattisupermercado/pindorama-matriz-centro-avenida-rio-branco"
            const productsUrls: any[] = [
                "/produtos/limpeza/utensilios-de-limpeza",
                "/produtos/limpeza/inseticidas",
                "/produtos/limpeza/casa-em-geral",
                "/produtos/limpeza/cozinha",
                "/produtos/limpeza/alcoois-e-removedores",
                "/produtos/limpeza/desodorizadores-e-aromatizantes",
                "/produtos/limpeza/roupas",
                "/produtos/alimentos-basicos/ovos",
                "/produtos/alimentos-basicos/sal",
                "/produtos/alimentos-basicos/acucares-e-adocantes",
                "/produtos/alimentos-basicos/farinaceos-e-amidos",
                "/produtos/alimentos-basicos/oleos-azeites-e-vinagres",
                "/produtos/alimentos-basicos/arroz",
                "/produtos/alimentos-basicos/massas-secas",
                "/produtos/alimentos-basicos/feijao",
                "/produtos/feira/frutas",
                "/produtos/feira/legumes",
                "/produtos/feira/verduras",
                "/produtos/feira/frutas-secas",
                "/produtos/feira/temperos-frescos",
                "/produtos/feira/prontos-para-consumo",
                "/produtos/carnes-aves-e-peixes/aves",
                "/produtos/carnes-aves-e-peixes/bovinos",
                "/produtos/carnes-aves-e-peixes/carnes-secas-salgadas-ou-defumadas",
                "/produtos/carnes-aves-e-peixes/linguicas-e-salsichas",
                "/produtos/carnes-aves-e-peixes/suinos",
                "/produtos/carnes-aves-e-peixes/peixes",
                "/produtos/carnes-aves-e-peixes/frutos-do-mar",
                "/produtos/carnes-aves-e-peixes/carnes-especiais",
                "/produtos/bebidas/aguas",
                "/produtos/bebidas/chas-prontos",
                "/produtos/bebidas/sucos",
                "/produtos/bebidas/refrigerantes",
                "/produtos/bebidas/isotonicos-e-energeticos",
                "/produtos/bebidas/achocolatados-e-bebidas-lacteas",
                "/produtos/bebidas/bebidas-de-soja",
                "/produtos/bebidas-alcoolicas/cervejas",
                "/produtos/bebidas-alcoolicas/destilados",
                "/produtos/bebidas-alcoolicas/whiskies",
                "/produtos/bebidas-alcoolicas/vinhos",
                "/produtos/higiene-e-cuidados-pessoais/higiene-bucal",
                "/produtos/higiene-e-cuidados-pessoais/corpo",
                "/produtos/higiene-e-cuidados-pessoais/higiene",
                "/produtos/higiene-e-cuidados-pessoais/farmacia",
                "/produtos/higiene-e-cuidados-pessoais/cabelo",
                "/produtos/higiene-e-cuidados-pessoais/bebe",
                "/produtos/biscoitos-e-salgadinhos/amendoins-e-cia",
                "/produtos/biscoitos-e-salgadinhos/biscoitos-salgados",
                "/produtos/biscoitos-e-salgadinhos/biscoitos-doces",
                "/produtos/biscoitos-e-salgadinhos/salgadinhos-e-snacks"
            ]

            var arrayProducts: Promise<any>[] = []
            var arrayProductsAux: Promise<any>[] = []


            const browser: puppeteer.Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

            let page = await browser.newPage()

            await page.goto(baseUrl).then(async () => {

                await page.waitForNavigation()

                await this.scrollToBottom(page)

                //Promoções
                //#region   
                this.getPromotionals(await page.content())
                await page.close().catch(error => { })
                //#endregion

                let arrayTemp: any[] = productsUrls

                while (arrayTemp.length > 0) {

                    let urls: any[] = arrayTemp.splice(0, 15)
                    urls.forEach(async (url: any) => {
                        arrayProductsAux.push(new Promise(async (resolve, reject) => {

                            let newPage = await browser.newPage()

                            await newPage.goto(baseUrl + url, {timeout: 60 * 1000}).then(async () => {
                                await newPage.waitForNavigation()
                                await this.scrollToBottom(newPage)

                                let array: any = await this.scrapePage(await newPage.content())
                                await newPage.close().catch(error => { })

                                let cat: string = '/' + url.split('/')[2] + '/'
                                array.forEach(async (item: any) => {
                                    item.category = await model.categoryModel.findOne({ url: cat }, { _id: true })

                                    await item.save()
                                    resolve(item)
                                })
                                console.log(url + " --> OK  [" + array.length + "]")
                            })

                            resolve()

                        }))
                    })

                    await Promise.all(arrayProductsAux).then(result => {
                        resolve(result)
                    })
                
                }

                await Promise.all(arrayProducts).then(result => {
                    console.log('Finalizado')
                })
                await browser.close().catch(error => {})
                resolve()
            })
        })
    }
}

export const bgtService = new bgtServices()

