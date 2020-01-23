import mongoose from 'mongoose'
import {config} from './config'

class mongoDB {

    init(){
        mongoose.connect(config.DBase.path + config.DBase.base, {useNewUrlParser: true}).then((result: any) => {
            console.log('Mongo conectado em: ', result.connections[0].host, '-->', result.connections[0].name)
        }).catch(error => {
            console.log('Erro ao conectar no mongodb: ', error)
        })   
    }
}

export const mongo = new mongoDB();