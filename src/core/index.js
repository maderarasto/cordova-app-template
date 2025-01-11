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
  viewBox: 'viewbox',
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

const AppContext = {
  router: null
}

export const JSX = (() => {
  const checkElementAttribute = (element, attributeName) => {
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
    }

    return attributeName.startsWith('data-') || attributeName in element;
  }

  const resolveElementAttributes = (element, props) => {
    Object.entries(props).forEach(([key, value]) => {
      if (!checkElementAttribute(element, key)) {
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
      if (tag === null || tag === 'FRAGMENT') {
        return children.flat();
      }

      if (typeof tag === 'function') {
        return tag({...props, children}, AppContext);
      }

      const element = document.createElement(tag);

      if (props) {
        resolveElementAttributes(element, props);
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
   * @returns {RouteInfo}
   */
  get currentRoute() {
    if (history.length === 0) {
      throw new Error('Router shouldn\'t be empty!');
    }

    return history[history.length - 1];
  }

  /**
   * Gets a previous route in router. If there is only one route it will return undefined;
   */
  get prevRoute() {
    if (history.length === 0) {
      throw new Error('Router shouldn\'t be empty!');
    }

    return history[history.length - 2];

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
   * Navigates
   * @param path
   */
  navigate(path) {
    const route  = this._findRoute(path);

    if (!route) {
      throw new Error(`Could not find a registered route with href "${path}"`);
    }
    console.log(route);
    // TODO: create instance of route component
    // TODO: push route into history
    // TODO: request application to update render
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

    // TODO: destroy current instance
    // TODO: pop route from history
    // TODO: create instance of route component
    // TODO: push route into history
    // TODO: request application to update render
  }

  /**
   * Reset history of router and if path is present it will navigate to it.
   *
   * @param path
   */
  reset(path) {

  }

  goBack() {
    if (!this.prevRoute) {
      // TODO: request app to close application
      return;
    }

    // TODO: destroy current instance
    // TODO: pop route from history
    // TODO: trigger onPrevRoute event on previous route component
    // TODO: request app to update render
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

export class CordovaApp {

  /**
   * Creates a cordova app.
   *
   * @param {AppConfig} config
   */
  constructor(config) {
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
  }

  render() {
    let nodes;

    if (Array.isArray(this._component)) {
      nodes = this._component;
    } else {
      nodes = [this._component];
    }

    if (this._rootEl.children.length > 0) {
      this._rootEl.innerHTML = '';
    }

    nodes.forEach((node) => {
      if (node instanceof Node) {
        this._rootEl.appendChild(node)
      }
    });
  }

  onCordovaReady(config) {
    /** @type {HTMLElement|null} */
    this._rootEl = document.querySelector(config.selector);

    if (!this._rootEl) {
      throw new Error(`Could not find the container with selector "${config.selector}"!`);
    }

    /** @type {ElementNode} */
    this._component = config.component;

    if (config.router) {
      AppContext.router = config.router;
      config.router.use(this);
    }

    this.render();
  }
}