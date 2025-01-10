/** @type {AppConfig} */
const DEFAULT_CONFIG = {
  selector: '',
};

export class CordovaApp {

  /**
   * Creates a cordova app.
   *
   * @param {AppConfig} config
   */
  constructor(config = DEFAULT_CONFIG) {
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

    if (Array.isArray(this.component)) {
      nodes = this.component;
    } else {
      nodes = [this.component];
    }

    if (this.rootEl.children.length > 0) {
      this.rootEl.innerHTML = '';
    }

    nodes.forEach((node) => {
      if (node instanceof Node) {
        this.rootEl.appendChild(node)
      }
    });
  }

  onCordovaReady(config) {
    /** @type {HTMLElement|null} */
    this.rootEl = document.querySelector(config.selector);

    /** @type {ElementNode} */
    this.component = config.component;

    /** @type {unknown} */
    this.rooter = config.rooter;

    if (!this.rootEl) {
      throw new Error(`Could not find the container with selector "${config.selector}"!`);
    }

    this.render();
  }
}