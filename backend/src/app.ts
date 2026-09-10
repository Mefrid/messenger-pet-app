import dotenv from 'dotenv'
import { server } from './implementation/api/server.ts'

dotenv.config()

const port = Number(process.env?.['PORT'])

server.listen(port, '0.0.0.0', () => console.log(`API is running on http://localhost:${port}`))
