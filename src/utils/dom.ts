import { ALL_COLOR_SCHEME_CLASSNAMES } from "@/utils/constants";

/**
 *
 * @param {String} className the class name to set on the html document
 * @returns {void}
 */
export function setHtmlDocumentColorScheme(className: string) {
  ALL_COLOR_SCHEME_CLASSNAMES.forEach((name) => {
    if (name && name.length > 0 && document.documentElement.classList.contains(name))
      document.documentElement.classList.remove(name);
  });

  if (className && className.length > 0 && ALL_COLOR_SCHEME_CLASSNAMES.includes(className as any)) {
    document.documentElement.classList.add(className);
  }

  return;
}
