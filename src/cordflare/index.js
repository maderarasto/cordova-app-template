export const Fragment = (...children) => {
  return children;
}

export class CordovaApp {
  /**
   * Creates an instance of application with given config.
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

    // if (!config.component) {
    //   throw new Error('Missing required component as root for app!');
    // }

    document.addEventListener('deviceready', this.onCordovaReady.bind(this, config));
  }

  render() {
  }

  close() {
    navigator.app.exitApp();
  }

  /**
   * Handles resources after cordova is loaded.
   *
   * @param {AppConfig} config
   */
  onCordovaReady(config) {
    /** @type {HTMLElement|null} */
    this._rootEl = document.querySelector(config.selector);

    if (!this._rootEl) {
      throw new Error(`Could not find the container with selector "${config.selector}"!`);
    }

    this._processJSXNode('root', config.component);

    this.render();
  }

  /**
   *
   * @param {string} parent
   * @param {CordFlare.JSX} node
   * @private
   */
  _processJSXNode(parent, {
    elementName,
    attributes,
    children,
  }) {
    if (typeof elementName === 'function') {

    }


  }
}



export class Component {
  constructor(key, props) {
    this.key = key;
    this.props = props;
  }

  render() {
    return null;
  }
}