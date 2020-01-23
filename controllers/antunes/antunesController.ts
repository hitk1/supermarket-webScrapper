import { Generics } from '../../environment/generic';
import { resolve } from 'url';
import {antunesService} from './antunesService'

class antunesControllers extends Generics {

    constructor(){
        super()
    }

    applyRoutes(router: any){

        router.get('/test', async(ctx: any, next: any) => {
            
        })

        router.get('/antunes/scrape', async(ctx: any, next: any) => {
            try{
                await antunesService.scrape().then(result => {
                    //ctx.body = this.validResult(result)
                })
                ctx.body = this.validResult('Minerando dados da pagina')
            } catch(error){
                ctx.body = this.invalidResult('Ocorreu um erro inesperado\n ' + error)
            }
        })
    }
}


export const antunesController = new antunesControllers()