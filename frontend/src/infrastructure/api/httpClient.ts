export class ServerError {
  constructor(
    public name:
      'UnauthorizedError' | 'ForbiddenError' | 'ValidationError' | 'NotFoundError' | 'TimeoutError',
    public message: string,
    public details?: unknown,
  ) {}
}

export type HttpResponse<DataType extends object> = {
  status: number
  data: DataType
}

export type HttpCommonOptions = Partial<{
  headers: Record<string, string>
  signal: AbortSignal
}>

export interface IHttpClient {
  get<ResponseData extends object>(
    resource: string,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>>

  post<ResponseData extends object>(
    resource: string,
    body?: Record<string, unknown>,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>>

  put<ResponseData extends object>(
    resource: string,
    body?: Record<string, unknown>,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>>

  delete<ResponseData extends object>(
    resource: string,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>>
}
