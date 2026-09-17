import axios, {
  AxiosError,
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import {
  ServerError,
  type HttpCommonOptions,
  type HttpResponse,
  type IHttpClient,
} from './/httpClient'
import type { IAuthTokenProvider } from '@/application/ports/authTokenProvider'
import { ROUTE_NAMES, type IRouter } from '../../application/ports/router'
import type { IWebSocketClient } from '@/application/ports/webSocketClient'

export class AxiosHttpClient implements IHttpClient {
  private axios: AxiosInstance
  private accessTokenProvider: IAuthTokenProvider
  private webSocketClient: IWebSocketClient
  private router: IRouter
  private isRefreshTokenUpdating = false
  private failedRequests: {
    resolve: (token: string | null) => void
    reject: (error: AxiosError) => void
  }[] = []

  constructor(
    accessTokenProvider: IAuthTokenProvider,
    webSocketClient: IWebSocketClient,
    router: IRouter,
  ) {
    this.router = router
    this.webSocketClient = webSocketClient
    this.accessTokenProvider = accessTokenProvider
    this.axios = axios.create({
      baseURL: `/api/v1`,
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.axios.interceptors.request.use(async (config) => {
      const accessToken = await this.accessTokenProvider.get()
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`

        if (!this.webSocketClient.isConnected()) {
          this.webSocketClient.connect(accessToken)
        }
      }
      return config
    })

    // https://axios.rest/pages/advanced/authentication.html#token-refresh
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!isAxiosError(error)) {
          return Promise.reject(error)
        }

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry: boolean }
        const currentRouteName = this.router.getCurrentRouteName()

        if (error.response) {
          if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            currentRouteName !== ROUTE_NAMES.LOGIN
          ) {
            if (this.isRefreshTokenUpdating) {
              return new Promise((resolve, reject) => {
                this.failedRequests.push({ resolve, reject })
              })
                .then((token) => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`
                  this.webSocketClient.connect(token as string)
                  return this.axios(originalRequest)
                })
                .catch((err) => Promise.reject(this.createServerError(err)))
            }

            originalRequest._retry = true
            this.isRefreshTokenUpdating = true

            try {
              const newToken = await this.updateAccessToken()

              this.processFailedRequests(null, newToken)

              return this.axios(originalRequest)
            } catch (refreshError) {
              this.processFailedRequests(refreshError as AxiosError, null)

              await this.accessTokenProvider.clear()

              this.router.changeRoute(ROUTE_NAMES.LOGIN)

              return Promise.reject(this.createServerError(refreshError as AxiosError))
            } finally {
              this.isRefreshTokenUpdating = false
            }
          }

          return Promise.reject(this.createServerError(error))
        } else if (error.request) {
          const timeoutError = new ServerError('TimeoutError', 'Server is not responding.')
          return Promise.reject(timeoutError)
        }

        return Promise.reject(error)
      },
    )
  }

  private createServerError(error: AxiosError): ServerError {
    const data = error.response?.data as Record<string, string>
    return new ServerError(data.name as ServerError['name'], data.message!, data.details)
  }

  private async updateAccessToken() {
    const { data } = await axios.post<{ accessToken: string }>(`/api/v1/auth/refresh`, undefined, {
      withCredentials: true,
    })

    const newToken = data.accessToken
    await this.accessTokenProvider.save(newToken)
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    return newToken
  }

  private processFailedRequests(error: AxiosError | null, token: string | null = null) {
    this.failedRequests.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    this.failedRequests = []
  }

  private mapToAxiosOptions(options?: HttpCommonOptions): AxiosRequestConfig | undefined {
    if (!options) {
      return undefined
    }
    return {
      headers: options.headers,
      signal: options.signal,
    }
  }

  async get<ResponseData extends object>(
    url: string,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>> {
    const { data, status } = await this.axios.get<ResponseData>(
      url,
      this.mapToAxiosOptions(options),
    )
    return {
      data,
      status,
    }
  }

  async post<ResponseData extends object>(
    url: string,
    body?: Record<string, unknown>,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>> {
    const { data, status } = await this.axios.post<ResponseData>(
      url,
      body,
      this.mapToAxiosOptions(options),
    )
    return {
      data,
      status,
    }
  }

  async put<ResponseData extends object>(
    url: string,
    body?: Record<string, unknown>,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>> {
    const { data, status } = await this.axios.put<ResponseData>(
      url,
      body,
      this.mapToAxiosOptions(options),
    )
    return {
      data,
      status,
    }
  }

  async delete<ResponseData extends object>(
    url: string,
    options?: HttpCommonOptions,
  ): Promise<HttpResponse<ResponseData>> {
    const { data, status } = await this.axios.delete<ResponseData>(
      url,
      this.mapToAxiosOptions(options),
    )
    return {
      data,
      status,
    }
  }
}
