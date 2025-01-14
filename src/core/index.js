import {unslug} from "@/core/utils";

const RESERVED_ATTR_BINDINGS = {
  acceptCharset: 'accept-charset',
  autoCapitalize: 'autocapitalize',
  autoComplete: 'autocomplete',
  autoFocus: 'autofocus',
  className: 'class',
  fillOpacity: 'fill-opacity',
  htmlFor: 'for',
  readOnly: 'readonly',
  strokeWidth: 'stroke-width',
  tabIndex: 'tabindex',
  viewBox: 'viewBox',
}

const RESERVED_ARIA_ATTR_BINDINGS = {
  ariaActiveDescendant: 'aria-activedescendant',
  ariaAutoComplete: 'aria-autocomplete',
  ariaColCount: 'aria-colcount',
  ariaColIndex: 'aria-colindex',
  ariaColSpan: 'aria-colspan',
  ariaDescribedBy: 'aria-describedby',
  ariaDropEffect: 'aria-dropeffect',
  ariaErrorMessage: 'aria-errormessage',
  ariaFlowTo: 'aria-flowto',
  ariaHasPopUp: 'aria-haspopup',
  ariaKey: 'aria-keyshortcuts',
  ariaLabelledBy: 'aria-labelledby',
  ariaMultiLine: 'aria-multiline',
  ariaMultiSelectable: 'aria-multiselectable',
  ariaPosInSet: 'aria-posinset',
  ariaReadOnly: 'aria-readonly',
  ariaRoleDescription: 'aria-roledescription',
  ariaRowCount: 'aria-rowcount',
  ariaRowIndex: 'aria-rowindex',
  ariaRowSpan: 'aria-rowspan',
  ariaSetSize: 'aria-setsize',
  ariaValueMax: 'aria-valuemax',
  ariaValueMin: 'aria-valuemin',
  ariaValueNow: 'aria-valuenow',
  ariaValueText: 'aria-valuetext',
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SVG_CHILD_TAGS = {
  structural: [ "defs", "g", "symbol", "use", "svg", "switch" ],
  graphics: [ "circle", "ellipse", "line", "path", "polygon", "polyline", "rect", "text", "tspan", "textPath", "image",
    "foreignObject" ],
  descriptive: [ "desc", "title" ],
  gradientAndColor: [ "linearGradient", "radialGradient", "stop", "pattern", "clipPath", "mask", "filter", "feBlend",
    "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap",
    "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage",
    "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile",
    "feTurbulence" ],
  animationAndInteraction: [ "animate", "animateMotion", "animateTransform", "discard", "mpath", "set" ],
  scripting: [ "script" ]
};

const AppContext = {
  router: null
}

/**
 *
 * @type {CordovaApp|null}
 */
let app = null;

export const JSX = (() => {
  const checkElementAttribute = (tag, element, attributeName) => {
    const findAriaKey = (ariaAttrName) => {
      const foundEntry = Object.entries(RESERVED_ARIA_ATTR_BINDINGS).find(([_, value]) => {
        return value === ariaAttrName;
      });

      return foundEntry ? foundEntry[0] : '';
    }

    if (attributeName.startsWith('on') && attributeName.toLowerCase() in element) {
      return true;
    }

    if (attributeName.startsWith('aria-') && findAriaKey(attributeName) in element) {
      return true;
    } else if (attributeName.startsWith('aria-') && unslug(attributeName, 'CamelCase') in element) {
      return true;
    } else if (tag === 'svg' || Object.values(SVG_CHILD_TAGS).flat().includes(tag)) {
      return true;
    }

    return attributeName.startsWith('data-') || attributeName in element;
  }

  const resolveElementAttributes = (tag, element, props) => {
    Object.entries(props).forEach(([key, value]) => {
      if (!checkElementAttribute(tag, element, key)) {
        return;
      }

      let attributeName = key;

      if (Object.keys(RESERVED_ATTR_BINDINGS).includes(attributeName)) {
        attributeName = RESERVED_ATTR_BINDINGS[key];
      }

      if (attributeName.startsWith('on')) {
        element.addEventListener(attributeName.slice(2).toLowerCase(), value);
      } else if (attributeName.startsWith('data-')) {
        const dataKey = unslug(attributeName.slice(5), 'CamelCase');
        element.dataset[dataKey] = '' + value;
      } else {
        element.setAttribute(attributeName, value);
      }
    });
  }

  return {
    createElement: (tag, props, ...children) => {
      if (!app) {
        throw new Error('Missing instance of application!');
      }

      if (tag === null || tag === 'FRAGMENT') {
        return children.flat();
      }

      if (typeof tag === 'function') {
        const component = app.registerComponent(tag, {
          ...props,
          children
        }, AppContext);

        // Additional processing
        component.didMount();

        return component.render();
      }

      let element = document.createElement(tag);

      if (tag === 'svg' || Object.values(SVG_CHILD_TAGS).flat().includes(tag)) {
        element = document.createElementNS(SVG_NAMESPACE, tag);
      }

      if (props) {
        resolveElementAttributes(tag, element, props);
      }

      children.forEach((child) => {
        let nestedChildren = [];

        if (typeof child === 'string' || typeof child === 'number') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          nestedChildren = [child];
        } else if (Array.isArray(child)) {
          nestedChildren = child;
        }

        nestedChildren.forEach((child) => {
          element.appendChild(child);
        })
      });

      return element;
    },
  };
})();

export class Component {
  constructor(key, props, context) {
    this.props = props;
    this.context = context;

    // Assign a unique key to pass to JSX
    this.props['key'] = key;
  }

  didMount() {}

  /**
   * Returns JSX view of component.
   *
   * @returns {ElementNode}
   */
  render() {
    return null;
  }
}

export class CordovaRouter {
  /**
   *
   * @param {RouterConfig} config
   */
  constructor(config) {
    /** @type {CordovaApp|null} */
    this._app = null;
    /** @type {RouteRecord[]} */
    this._routes = [];
    /** @type {RouteInfo[]} */
    this._history = [];

    this._resolveRoutes(config.routes);
  }

  /**
   * Gets a current route in router.
   *
   * @returns {RouteInfo|null}
   */
  get currentRoute() {
    return this._history.length > 0 ? this._history[this._history.length - 1] : null;
  }

  /**
   * Gets a previous route in router. If there is only one route it will return undefined;
   */
  get prevRoute() {
    return this._history.length > 1 ? this._history[this._history.length - 2] : null;

  }

  /**
   * Attach router to cordova app instance.
   *
   * @param {CordovaApp} app
   */
  use(app) {
    this._app = app;
  }

  /**
   * Finds a component of route based on given path.
   *
   * @param {string} path
   */
  findRouteComponent(path) {
    const route = this._findRoute(path);

    if (!route) {
      return null
    }

    return route.component;
  }

  /**
   * Navigates
   * @param path
   */
  navigate(path) {
    const route  = this._findRoute(path);

    if (!route) {
      throw new Error(`Could not find a registered route with href "${path}"`);
    }

    this._history.push({
      path: route.path,
      name: route.name,
    });

    if (!this._app) {
      throw new Error('Router isn\'t attached to application!');
    }

    this._app.update();
  }

  /**
   * Replaces a current route in history with new based on given path.
   *
   * @param {string} path
   */
  replace(path) {
    const route  = this._findRoute(path);

    if (!route) {
      throw new Error(`Could not find a registered route with href "${path}"`);
    }

    this._history.pop();
    this._history.push({
      path: route.path,
      name: route.name,
    });

    if (!this._app) {
      throw new Error('Router isn\'t attached to application!');
    }

    this._app.update();
  }

  /**
   * Reset history of router and if path is present it will navigate to it.
   *
   * @param path
   */
  reset(path) {
    this._history = [];

    if (path) {
      this.navigate(path);
    }
  }

  goBack() {
    if (!this.prevRoute) {
      this._app.close();
      return;
    }

    this._history.pop();
    // TODO: trigger onPrevRoute event on previous route component
    this._app.update();
  }

  /**
   * Removes trailing and ending '/' from path.
   *
   * @param {string} path
   * @private
   */
  _normalizePath(path) {
    return path.replace(/^\/|\/$/g, '');
  }

  _resolveRoutes(routes = [], parentPath = '') {
    routes.forEach(routeDef => {
      const route = {
        path: this._normalizePath(parentPath + '/' + routeDef.path),
        name: routeDef.name,
        component: routeDef.component,
      };

      this._routes.push(route);

      if (routeDef.children && Array.isArray(routeDef.children)) {
        this._resolveRoutes(routeDef.children, route.path);
      }
    });
  }

  /**
   *
   * @param {string} path
   * @private
   */
  _findRoute(path) {
    return this._routes.find(route => {
      if (route.path === path) {
        return true;
      }

      const routePathTokens = this._normalizePath(route.path).split('/');
      const nextPathTokens = this._normalizePath(path).split('/');

      if (routePathTokens.length !== nextPathTokens.length) {
        return false;
      }

      const finalPath = routePathTokens.reduce((result, token, index) => {
        return result + '/' + (token.startsWith(':') ? nextPathTokens[index] : token);
      }, '');

      return this._normalizePath(path) === this._normalizePath(finalPath);
    });
  }
}

// export const RouterView = ({options}, {router}) => {
//   const initialPath = options && options.initialPath ? options.initialPath : '';
//
//   if (!router.currentRoute) {
//     router.navigate(initialPath);
//     return;
//   }
//
//   const routeComponent = router.findRouteComponent(
//     router.currentRoute.path
//   );
//
//   if (routeComponent) {
//     return routeComponent();
//   }
//
//   return <></>;
// }

export class RouterView extends Component {
  constructor(key, props, context) {
    super(key, props, context);
  }

  didMount() {
    const initialPath = this.props.options && this.props.options.initialPath
      ? this.props.options.initialPath : '';

    if (!this.context.router.currentRoute) {
      this.context.router.navigate(initialPath);
    }
  }

  render() {
    const currentRoute = this.context.router.currentRoute;
    const routeComponentFn = currentRoute
      ? this.context.router.findRouteComponent(currentRoute.path)
      : null;

    return (
      <>
        <RouterView.Header options={{
          headerTitle: 'Router',
          headerLeft: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width={24} height={24} fill="#fff">
              <path
                d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
            </svg>
          )
        }}/>
        <div className="main">
          {routeComponentFn ? routeComponentFn() : ''}
        </div>
      </>
    )
  }
}

RouterView.Header = class extends Component {
  constructor(key, props, context) {
    super(key, props, context);
  }

  render() {
    const resolveTitle = () => {
      const headerTitle = this.props.options && this.props.options.headerTitle
        ? this.props.options.headerTitle
        : null;

      if (!headerTitle) {
        return '';
      }

      return typeof headerTitle === 'function' ? headerTitle() : (
        <span style="font-size: 20px; font-weight: 600; color: white">
          {headerTitle}
        </span>
      );
    }

    const resolveHeaderLeft = () => {
      const headerLeft = this.props.options && this.props.options.headerLeft
        ? this.props.options.headerLeft
        : null;

      if (headerLeft && typeof headerLeft === 'function') {
        return headerLeft();
      }

      return null;
    }

    const resolveHeaderRight = () => {
      const headerRight = this.props.options && this.props.options.headerRight
        ? this.props.options.headerRight
        : null;

      if (headerRight && typeof headerRight === 'function') {
        return headerRight();
      }

      return null;
    }

    if (this.props.options && this.props.options.headerShown === false) {
      return null;
    }

    return (
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; height: 70px; padding-inline: 16px; background: black;">
        {/* Left side of header */}
        <div>{resolveHeaderLeft()}</div>
        <div>{resolveTitle()}</div>
        {/* Right side of header */}
        <div>{resolveHeaderRight()}</div>
      </div>
    )
  }
}

export class CordovaApp {

  /**
   * Creates a cordova app.
   *
   * @param {AppConfig} config
   */
  constructor(config) {
    this._components = new Map();
    this._keyCount = 0;

    if (!config || typeof config !== 'object') {
      throw new Error('Missing required AppConfig object!');
    }

    if (!config.selector) {
      throw new Error('Missing required selector for app container!');
    }

    if (!config.component) {
      throw new Error('Missing required component as root for app!');
    }

    document.addEventListener('deviceready', this.onCordovaReady.bind(this, config));

    // Store instance of app to variable in scope of this script.
    app = this;
  }



  /**
   *
   * @param {Function} componentFn
   * @param props
   * @param context
   */
  registerComponent(componentFn, props, context) {
    let componentKey = props.key;

    if (componentKey && this._components.has(componentKey)) {
      return this._components.get(componentKey).render();
    } else {
      componentKey = this._getNewKey();
    }

    const component = new componentFn(componentKey, props, context);
    this._components.set(componentKey, component);

    // Additional process of component

    return component;
  }

  async update() {
    await this.render();
  }

  async render() {
    let nodes;
    const content = this._root();

    if (Array.isArray(content)) {
      nodes = content;
    } else {
      nodes = content;
    }

    if (this._rootEl.children.length > 0) {
      this._rootEl.innerHTML = '';
    }

    nodes.forEach((node) => {
      if (node instanceof Node) {
        this._rootEl.appendChild(node)
      }
    });

    // TODO: trigger mount event
  }

  close() {
    navigator.app.exitApp();
  }

  _getNewKey() {
    const incrementStr = (++this._keyCount).toString();
    const paddedNum = incrementStr.padStart(5, '0');

    return btoa(paddedNum).toString();
  }

  onCordovaReady(config) {
    /** @type {HTMLElement|null} */
    this._rootEl = document.querySelector(config.selector);

    if (!this._rootEl) {
      throw new Error(`Could not find the container with selector "${config.selector}"!`);
    }

    /** @type {() => ElementNode} */
    this._root = config.component;

    if (config.router) {
      AppContext.router = config.router;
      config.router.use(this);
    }

    this.render();
  }
}