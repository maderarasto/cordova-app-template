declare namespace CordFlare {
  type JSX = {
    elementName: string|Function
    attributes: Record<string, any>
    children: JSX[]
  }

  type AppConfig = {
    selector: string
    component: unknown
  }
}