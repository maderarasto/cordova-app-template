import {default as routeDefs} from "@/routes";
import App from "@/app/App";
import app from "@/app/App";

/** @type {AppConfig} */
const DEFAULT_CONFIG = {
    selector: '',
};

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

// window.onerror = (msg, url, line, col, error) => {
//
// }

/**
 * Checks if text is capitalized.
 *
 * @param {string} text
 * @returns {boolean}
 */
const isCapitalized = (text) => {
    let [first, ...others] = [...text];
    others = others.join('');

    return first === first.toUpperCase() && others === others.toLowerCase();
};

/**
 * Convert text to capitalized text.
 *
 * @param {string} text
 */
const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert text to slug format.
 *
 * @param {string} text
 */
const slug = (text) => {
    if (isCapitalized(text)) {
        text = text.charAt(0).toLowerCase() + text.slice(1);
    }

    const tokens = text.split(/(?=[A-Z])/);

    /** @type {string} */
    let slug;

    slug = tokens.reduce((result, token) => {
        return result + token.toLowerCase() + '-'
    }, '');

    if (slug.length > 0) {
        slug = slug.slice(0, slug.length - 1);
    }

    return slug;
}

/**
 * Converts a slug text to certain case type text.
 *
 * @param {string} slug
 * @param {CaseType} type
 */
const unslug = (slug, type= 'PascalCase') => {
    const tokens = slug.split(/-/g);

    let text = tokens.reduce((result, token, index) => {
        if (type === 'CamelCase' && index === 0) {
            return result + token.toLowerCase();
        }

        return result + (type === 'SnakeCase' ? token.toLowerCase() + '-' : capitalize(token));
    }, '');

    if (type === 'SnakeCase') {
        text = text.slice(0, text.length - 1);
    }

    return text;
}

/**
 *
 * @param {AppConfig} config
 * @returns {App}
 */
const initApp = (config) => {
    /** @type {HTMLDivElement|null} */
    const root = document.querySelector(config.selector);
    // const navigation = createNavigation(this);

    if (!root) {
        throw new Error(`Could not find the container with selector "${config.selector}"!`);
    }

    (() => {
        const appContent = App();
        let nodes = [];

        if (Array.isArray(appContent)) {
            nodes = appContent;
        } else {
            nodes = [appContent];
        }

        nodes.forEach((node) => {
            if (node instanceof Node) {
                root.appendChild(node)
            }
        });
    })();

    return {}
};

/**
 * Create a navigation for application.
 *
 * @param {App} application
 * @returns {Navigation}
 */
const createNavigation = (application) => {
    const app = application;

    /** @type {Route[]} */
    let routes = [];

    /** @type {Route[]} */
    let history = [];

    // Initialize routes
    (() => {
        if (!Array.isArray(routeDefs) || routeDefs.length === 0) {
            throw new Error('There should be at least one route defined in "src/routes.js"!');
        }

        routes = routeDefs.map(routeDef => ({
            ...routeDef,
            instance: null
        }))
    })();

    /**
     * Gets a normalized path removing slash character from both sides.
     *
     * @param {string} path
     * @returns {string}
     */
    const normalizePath = (path) => {
        return path.replace(/^\/|\/$/g, '');
    }

    /**
     * Finds a route in registered routes of navigation. If there isn't such route it will return null
     *
     * @param {string} href
     * @returns {Route|null}
     */
    const findRegisteredRoute = (href) => {
        return routes.find((route) => {
            if (route.path === href) {
                return true;
            }

            const pathTokens = normalizePath(route.path).split('/');
            const hrefTokens = normalizePath(href).split('/');

            if (pathTokens.length !== hrefTokens.length) {
                return false;
            }

            const finalHref = pathTokens.reduce((result, token, index) => {
                return result + '/' + (token.startsWith(':') ? hrefTokens[index] : token);
            }, '');

            return normalizePath(href) === normalizePath(finalHref);
        });
    }

    return {
        /**
         * Gets a current route in router's history.
         *
         * @returns {Route}
         */
        current: () => {
            if (history.length === 0) {
                throw new Error('Router shouldn\'t be empty!');
            }

            return history[history.length - 1];
        },

        /**
         * Gets a previous route in router's history.
         *
         * @returns {Route|null}
         */
        prev: () => {
            if (history.length === 0) {
                throw new Error('Router shouldn\'t be empty!');
            }

            return history.length > 1 ? history[history.length - 2] : null;
        },

        /**
         * Navigates to a new route and pushing it above previous route in stack.
         *
         * @param {string} href
         */
        navigate: (href) => {
            const routeDef = findRegisteredRoute(href);

            if (!routeDef) {
                throw new Error(`Could not find a registered route with href "${href}"`);
            }

            // TODO: create instance of route component
            // TODO: push route into history
            // TODO: request application to update render
        },

        goBack: () => {
            const prevRoute = this.prev();

            if (!prevRoute) {
                // TODO: request app to close application
                return;
            }

            // TODO: destroy current instance
            // TODO: pop route from history
            // TODO: trigger onPrevRoute event on previous route component
            // TODO: request app to update render
        },

        /**
         * Replaces current route with new route.
         *
         * @param {string} href
         */
        replace: (href) => {
            const routeDef = findRegisteredRoute(href);

            if (!routeDef) {
                throw new Error(`Could not find a registered route with href "${href}"`);
            }

            const currentRoute = this.current();

            // TODO: destroy current instance
            // TODO: pop route from history
            // TODO: create instance of route component
            // TODO: push route into history
            // TODO: request application to update render
        },

        /**
         * Clears all history including current route without updating application render.
         */
        clear: () => {
            history = [];
        }
    }
}

/**
 * Checks if attribute is part of HTML element.
 *
 * @param {HTMLElement} element
 * @param {string} attrName
 */
const checkElementAttr = (element, attrName) => {
    const findAriaKey = (ariaAttrName) => {
        const foundEntry = Object.entries(RESERVED_ARIA_ATTR_BINDINGS).find(([_, value]) => {
            return value === ariaAttrName;
        });

        return foundEntry ? foundEntry[0] : '';
    }

    if (attrName.startsWith('on') && attrName.toLowerCase() in element) {
        return true;
    }

    if (attrName.startsWith('aria-') && findAriaKey(attrName) in element) {
        return true;
    } else if (attrName.startsWith('aria-') && unslug(attrName, 'CamelCase') in element) {
        return true;
    }

    return attrName.startsWith('data-') || attrName in element;
}

const resolveElementAttrs = (element, props) => {
    Object.entries(props).forEach(([key, value]) => {
        if (!checkElementAttr(element, key)) {
            return;
        }

        let attrName = key;

        if (Object.keys(RESERVED_ATTR_BINDINGS).includes(attrName)) {
            attrName = RESERVED_ATTR_BINDINGS[key];
        }

        if (attrName.startsWith('on')) {
            element.addEventListener(attrName.slice(2).toLowerCase(), value);
        } else if (attrName.startsWith('data-')) {
            const dataKey = unslug(attrName.slice(5), 'CamelCase');
            element.dataset[dataKey] = '' + value;
        } else {
            element.setAttribute(attrName, value);
        }
    });
}

export const createElement = (tag, props, ...children) => {
    if (tag === null || tag === 'FRAGMENT') {
        return children.flat();
    }

    if (typeof tag === 'function') {
        return tag({ ...props, children })
    }

    console.log(props, children);

    const element = document.createElement(tag);

    if (props) {
        resolveElementAttrs(element, props);
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
}

/**
 * Creates application with given config
 * @param {AppConfig} config
 */
export const createApp = (config = DEFAULT_CONFIG) => {
    let app;

    if (!config || typeof config !== 'object') {
        throw new Error('Missing required AppConfig object!');
    }

    if (!config.selector) {
        throw new Error('Missing required selector for app container!');
    }

    document.addEventListener('deviceready', () => {
        app = initApp(config);
    });
}