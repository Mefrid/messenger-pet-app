import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  type IError,
} from '../../application/errors.js'

export const mapErrorToHTTPCode = (error: IError): number => {
  if (error instanceof UnauthorizedError) {
    return 401
  } else if (error instanceof ForbiddenError) {
    return 403
  } else if (error instanceof ValidationError) {
    return 422
  } else if (error instanceof NotFoundError) {
    return 404
  } else {
    return 500
  }
}
