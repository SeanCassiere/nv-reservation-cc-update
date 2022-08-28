export function base64Encode(s: string | number | boolean): string {
  const decode = window.unescape || window.decodeURI;
  return window.btoa(decode(encodeURIComponent(s)));
}

export function base64Decode(s: string): any {
  const encode = window.escape || window.encodeURI;
  return decodeURIComponent(encode(window.atob(s)));
}
