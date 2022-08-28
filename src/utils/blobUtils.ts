export async function urlToBlob(url: string) {
  return await fetch(url).then((response) => response.blob());
}

export async function urlBlobToBase64(url: string): Promise<string> {
  const blobbedUrl = await fetch(url).then((res) => res.blob());
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blobbedUrl);
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
}

export async function createHtmlBlobDataUrl(html: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  return url;
}

export async function dataBase64StringToBlobDataUrl(base64: string) {
  const binary = atob(base64.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: "image/png" });
  const url = URL.createObjectURL(blob);
  return url;
}
