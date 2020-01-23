import { Generics } from '../../environment/generic';
import { resolve } from 'url';
import {bgtService} from './bgtService'

class bgtControllers extends Generics {

    constructor(){
        super()
    }

    applyRoutes(router: any){

        router.get('/test', async(ctx: any, next: any) => {
            
        })

        router.get('/bigatti/scrape', async(ctx: any, next: any) => {
            try{
                await bgtService.scrape().then(result => {
                    //ctx.body = this.validResult(result)
                })
                ctx.body = this.validResult('Minerando dados da pagina')
            } catch(error){
                ctx.body = this.invalidResult('Ocorreu um erro inesperado\n ' + error)
            }
        })
    }
}


export const bgtController = new bgtControllers()