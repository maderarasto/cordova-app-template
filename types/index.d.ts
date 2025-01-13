type ElementNode = HTMLElement | Text
type ElementNodeFn = () => ElementNode

type CaseType = (
  | 'PascalCase'
  | 'CamelCase'
  | 'SnakeCase'
)

type AppConfig = {
  selector: string
  component: () => ElementNode
  router: Object
}

/** Start of Router defined types */
type RouterConfig = {
  routes: RouteDef[]
}

type RouteRecord = {
  path: string
  component?: () => ElementNode
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