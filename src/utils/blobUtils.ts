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
