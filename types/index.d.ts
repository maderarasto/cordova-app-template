type CaseType = (
  | 'PascalCase'
  | 'CamelCase'
  | 'SnakeCase'
)

/** Start of Application defined types */
type AppConfig = {
  selector: string
  component: ElementNode
  router?: Router
}

type App = {}


type ElementNode = HTMLElement | Text
type ElementNodeFn = () => ElementNode
/** End of Application defined types */

/** Start of Router defined types */
type RouterConfig = {
  routes: RouteDef[]
}

type Router = {
  /**
   * Attach router to app object.
   *
   * @param {App} app
   */
  use: (app: App) => void

  /**
   * Gets information about current route.
   */
  current: () => RouteInfo

  /**
   * Gets information about previous route. If there isn't history before current route it will return null.
   */
  prev: () => RouteInfo|null

  /**
   * Navigates router to a new route based on given path.
   *
   * @param {string} path
   */
  navigate: (path: string) => void

  /**
   * Replaces a current route with a new route based on given path.
   *
   * @param {string} path
   */
  replace: (path: string) => void

  /**
   * Navigates router back to previous route.
   */
  goBack: () => void

  /**
   * Resets history and navigate router to a new route if it's given.
   * @param path
   */
  reset: (path?: string) => void
}

type RouteRecord = {
  path: string
  component: ElementNode
  name?: string
}

type RouteDef = RouteRecord & {
  children?: RouteDef[]
}

type RouteInfo = {
  path: string
  params: Record<string, any>
  name?: string
}

/** End of Router defined types */