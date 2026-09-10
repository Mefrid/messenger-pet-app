import express from 'express'
import http from 'http'
import type { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import controllers from './controllers.js'
import { mapErrorToHTTPCode } from './utils.js'
import type { IError } from '../../application/errors.js'
import { config } from '../../config/appConfig.ts'
import { WebSocketServer } from './webSocket/webSocketServer.ts'
import { services } from '../../config/services.ts'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: config.allowedHost,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }),
)
app.use(express.urlencoded({ extended: false }))

app.get('/', async (_req, res) => {
  res.send({ name: 'Messenger API' })
})

controllers.attachHttpControllers(app)

app.use((error: IError, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  const httpCode = mapErrorToHTTPCode(error)
  res.status(httpCode).json({
    error: error.name,
    message: error.message,
    details: error?.details,
  })
})

app.use((req, res) => {
  res.status(404).send({
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.baseUrl}`,
  })
})

export const server = http.createServer(app)

const authProvider = new services.authProvider()
const userDAO = new services.userDAO()
const chatDAO = new services.chatDAO(userDAO)

export const wss = new WebSocketServer(server, authProvider, chatDAO)
