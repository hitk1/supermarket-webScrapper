import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import {config} from '../environment/config'
import {mongo} from '../environment/mongo'
import {Generics} from '../environment/generic'

const koaRouter = require('koa-router')
const koaBody = require('koa-body')
const koaLogger = require('koa-logger')

class koaServer {

    app: Koa
    router: any

    constructor(){
        this.router = new koaRouter()
        this.app = exports.module = new Koa()

        this.app.use(koaBody())
        this.app.use(koaLogger())

        mongo.init()
    }

    applyRoutes(controllers: Generics[]){

        for(let controller of controllers){
            controller.applyRoutes(this.router)
        }

        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())

        console.log(this.router.stack.map((i: any) => i.path));
    }

    init(){
        this.app.listen(config.koa.port)

        console.log(`Server on: http://localhost:${Number(config.koa.port)}`)
    }
}

export const server = new koaServer()

