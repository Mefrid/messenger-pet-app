import type { IAuthRepository, LoginResult } from '@/application/ports/authRepository'
import type { IAuthTokenProvider } from '@/application/ports/authTokenProvider'
import type { ICurrentUserStore } from '@/application/ports/currentUserStore'
import { ROUTE_NAMES, type IRouter } from '@/application/ports/router'
import type { IWebSocketClient } from '@/application/ports/webSocketClient'
import { login } from '@/application/useCases/login'
import type { IUser } from '@/domain/user'
import { describe, expect, test, vi } from 'vitest'

const CORRECT_LOGIN = 'TEST'
const CORRECT_PASSWORD = 'TEST123'

const mockUser: IUser = {
  id: 'testId123',
  name: 'John',
  surname: 'Doe',
  login: CORRECT_LOGIN,
  avatarUrl: '',
}

describe('Login use case', () => {
  const authRepository: IAuthRepository = {
    login: vi.fn((login: string, password: string) => {
      return new Promise<LoginResult>((resolve, reject) => {
        if (login === CORRECT_LOGIN && password === CORRECT_PASSWORD) {
          resolve({
            accessToken: 'accessToken123',
            user: mockUser,
          })
        } else {
          reject(new Error('Oops'))
        }
      })
    }),
    me: vi.fn(),
    logout: vi.fn(),
  }
  const currentUserStore: ICurrentUserStore = {
    storeCurrentUser: vi.fn(),
    getCurrentUser: vi.fn(),
  }
  const authTokenProvider: IAuthTokenProvider = {
    save: vi.fn(),
    get: vi.fn(),
    clear: vi.fn(),
  }
  const webSocketClient: IWebSocketClient = {
    connect: vi.fn(),
    isConnected: vi.fn(() => true),
    subscribe: vi.fn(),
    close: vi.fn(),
    sendMessage: vi.fn(),
  }
  const router: IRouter = {
    changeRoute: vi.fn(),
    getCurrentRouteName: vi.fn(),
    replace: vi.fn(),
  }

  const dependencies = {
    authRepository,
    currentUserStore,
    authTokenProvider,
    webSocketClient,
    router,
  }

  test('return user info if credentials are valid', async () => {
    const result = await login(dependencies, { login: CORRECT_LOGIN, password: CORRECT_PASSWORD })

    expect(result).toEqual(mockUser)
  })

  test('redirect to home page if credentials are valid', async () => {
    await login(dependencies, { login: CORRECT_LOGIN, password: CORRECT_PASSWORD })

    expect(dependencies.router.changeRoute).toHaveBeenCalledWith(ROUTE_NAMES.HOME)
  })

  test.for([
    ['Random login', CORRECT_PASSWORD],
    [CORRECT_LOGIN, 'Random password'],
    ['Random login', 'Random password'],
    ['', CORRECT_PASSWORD],
    [CORRECT_LOGIN, ''],
    ['', ''],
  ])(
    'throw an exception if login or password are incorrect (or left blank)',
    async ([loginValue, password]) => {
      await expect(
        login(dependencies, { login: loginValue!, password: password! }),
      ).rejects.toThrow()
    },
  )
})
