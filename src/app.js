import {default as routeDefs} from "@/routes";

/** @type {AppConfig} */
const DEFAULT_CONFIG = {
    selector: '',
};

// window.onerror = (msg, url, line, col, error) => {
//
// }

/**
 *
 * @param {AppConfig} config
 * @returns {App}
 */
const initApp = (config) => {
    /** @type {HTMLDivElement|null} */
    const container = document.querySelector(config.selector);
    const navigation = createNavigation();

    if (!container) {
        throw new Error(`Could not find the container with selector "${config.selector}"!`);
    }

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