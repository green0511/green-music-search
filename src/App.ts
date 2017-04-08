import * as path from 'path'
import * as express from 'express'
import * as logger from 'morgan'
import { QqRouter } from './routes/qq'

import * as bodyParser from 'body-parser'

export const app: express.Application = express()
setAppRoutes(app)
setMiddleWare(app)

function setAppRoutes(app: express.Application) {
  let defaultRouter = express.Router()
  defaultRouter.get('/', (req, res, next) => {
    res.json({
      date: new Date()
    })
  })
  app.use('/', defaultRouter)

  new QqRouter(app)
}

function setMiddleWare(app: express.Application) {
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
}