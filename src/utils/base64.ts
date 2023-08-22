// https://react-location.tanstack.com/guides/custom-search-param-serialization#safe-binary-encodingdecoding
export function base64Encode(str: string): string {
  return window.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}

export function base64Decode(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(window.atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}
