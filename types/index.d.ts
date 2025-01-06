type AppConfig = {
  selector: string
}

type App = {
}

type Navigation = {
  /**
   * Gets a current route in router's history.
   *
   * @returns {Route}
   */
  current: () => Route
  prev: () => Route|null
  navigate: (href: string) => void
  goBack: () => void
  replace: (href: string) => void
  clear: () => void
}

type RouteDefinition = {
  path: string
  component: Function
}

type Route = RouteDefinition & {
  instance: unknown
}