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

/**
 *
 * @param {string|Function} tag
 * @param {Record<string, any>|null} props
 * @param {ElementNode} children
 * @returns {ElementNode|ElementNode[]}
 */
window.createElement = (tag, props, ...children) => {
  if (tag === null || tag === 'FRAGMENT') {
    return children.flat();
  }

  if (typeof tag === 'function') {
    return tag({...props, children})
  }

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