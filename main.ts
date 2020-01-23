import {server} from './server/koaServer'
import { bgtController } from './controllers/bgt/bgtController'
import { antunesController } from './controllers/antunes/antunesController'

server.applyRoutes([bgtController, antunesController])
server.init()
