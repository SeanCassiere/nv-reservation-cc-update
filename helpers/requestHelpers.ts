export const containsKey = (rawQueryString: string, key: string): boolean => {
  return rawQueryString.indexOf(key) !== -1;
};

export const isValueTrue = (value: string | undefined | null | boolean): boolean => {
  if (!value) return false;
  return value &&
    ((typeof value === "string" && value.toLowerCase() === "true") ||
      (typeof value === "string" && value === "1") ||
      value === true)
    ? true
    : false;
};

export const responseHeaders = {
  "Content-Type": "application/json",
};
