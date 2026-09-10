export enum ROUTE_NAMES {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  SETTINGS = 'SETTINGS',
  CHAT = 'CHAT',
}

export interface IRouter {
  getCurrentRouteName(): ROUTE_NAMES
  changeRoute(routeName: ROUTE_NAMES, params?: Record<string, string | number>): Promise<void>
  replace(routeName: ROUTE_NAMES, params?: Record<string, string | number>): Promise<void>
}
