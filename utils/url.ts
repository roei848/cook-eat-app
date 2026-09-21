/**
 * Loose "looks like a web address" check shared by the add-recipe entry
 * screens: the URL screen rejects anything else, the text screen redirects it.
 */
export const HTTP_URL_REGEX = /^https?:\/\/.+\..+/i;

export function isHttpUrl(text: string): boolean {
  return HTTP_URL_REGEX.test(text.trim());
}
