export interface IError {
  name: string
  message: string
  details?: unknown
}

export class UnauthorizedError extends Error implements IError {
  public name = 'UnauthorizedError'

  constructor(public message: string = 'Unauthorized') {
    super(message)
  }
}

export class ValidationError extends Error implements IError {
  public name = 'ValidationError'

  constructor(
    public message: string = 'Provided data is invalid',
    public details?: { field: string; message: string }[] | string[],
  ) {
    super(message)
  }
}

export class NotFoundError extends Error implements IError {
  public name = 'NotFoundError'

  constructor(public message: string = 'Record not found') {
    super(message)
  }
}

export class ForbiddenError extends Error implements IError {
  public name = 'ForbiddenError'

  constructor(public message: string = 'Access denied') {
    super(message)
  }
}
