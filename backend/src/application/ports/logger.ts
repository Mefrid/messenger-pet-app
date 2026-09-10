import type { IError } from '../errors.js'

export interface ILogger {
  debug(message: string, payload: unknown): void
  info(message: string, payload: unknown): void
  warn(message: string, payload: unknown): void
  error(message: string, error: IError, payload: unknown): void
  fatal(message: string, error: IError, payload: unknown): void
}
