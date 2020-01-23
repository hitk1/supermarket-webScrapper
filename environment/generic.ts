
export class Generics {

    applyRoutes(koaRoute: any){
        
    }

    validResult(obj: any){
        return({success: true, data: obj})
    }

    invalidResult(error: string){
        return({success: false, message: error})
    }
}