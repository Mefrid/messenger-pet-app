import * as ws from 'ws'

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

declare module 'ws' {
  interface WebSocket {
    userId: string
  }
}

export {}
