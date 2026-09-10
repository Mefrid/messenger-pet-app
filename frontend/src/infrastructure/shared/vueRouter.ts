import type { Router } from 'vue-router'
import type { IRouter, ROUTE_NAMES } from '../../application/ports/router'

export class VueRouter implements IRouter {
  constructor(private vueRouter: Router) {}

  getCurrentRouteName(): ROUTE_NAMES {
    return this.vueRouter.currentRoute.value.name as ROUTE_NAMES
  }

  async changeRoute(
    routeName: ROUTE_NAMES,
    params: Record<string, string | number>,
  ): Promise<void> {
    await this.vueRouter.push({ name: routeName, params })
  }

  async replace(routeName: ROUTE_NAMES, params?: Record<string, string | number>): Promise<void> {
    await this.vueRouter.replace({ name: routeName, params })
  }
}
