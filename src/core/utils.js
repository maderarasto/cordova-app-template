/**
 * Checks if text is capitalized.
 *
 * @param {string} text
 * @returns {boolean}
 */
export const isCapitalized = (text) => {
  let [first, ...others] = [...text];
  others = others.join('');

  return first === first.toUpperCase() && others === others.toLowerCase();
};

/**
 * Convert text to capitalized text.
 *
 * @param {string} text
 */
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert text to slug format.
 *
 * @param {string} text
 */
export const slug = (text) => {
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
export const unslug = (slug, type = 'PascalCase') => {
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