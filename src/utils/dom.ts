import { ALL_THEME_CLASS_NAMES } from "@/utils/constants";

/**
 *
 * @param {String} className the class name to set on the html document
 * @returns {void}
 */
export function setHtmlDocumentTheme(className: string) {
  ALL_THEME_CLASS_NAMES.forEach((name) => {
    if (name && name.length > 0 && document.documentElement.classList.contains(name))
      document.documentElement.classList.remove(name);
  });

  if (className && className.length > 0 && ALL_THEME_CLASS_NAMES.includes(className as any)) {
    document.documentElement.classList.add(className);
  }

  return;
}
