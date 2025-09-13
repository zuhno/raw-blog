import { filesApi } from "../apis";

const useUploadImage = () => {
  const isBlobUrl = (v: unknown): v is string =>
    typeof v === "string" && v.startsWith("blob:");

  const mimeToExt = (mime: string) => {
    const map: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
      "image/svg+xml": "svg",
    };
    return map[mime];
  };

  const upload = async (blobUrl: string) => {
    const res = await fetch(blobUrl);
    if (!res.ok) return null;

    const blob = await res.blob();
    const ext = mimeToExt(blob.type) ?? "bin";
    const file = new File([blob], `temp.${ext}`, { type: blob.type });
    try {
      const result = await filesApi.postUploadImg(file);
      if (result.success) return result.data.url;
      return null;
    } catch {
      return null;
    }
  };

  const tiptapContentUpload = async (data: any) => {
    const cache = new Map<string, string>();

    const transformNode = async (node: typeof data) => {
      let next: any = { ...node };

      const src: unknown = next.attrs?.src;
      if (next.type === "image" && typeof src === "string") {
        if (isBlobUrl(src)) {
          let remote;
          if (cache.has(src)) {
            remote = cache.get(src)!;
          } else {
            remote = await upload(src);
            if (!remote) throw new Error("Image upload failed");
            cache.set(src, remote);
          }
          next = { ...next, attrs: { ...(next.attrs ?? {}), src: remote } };
        }
      }

      if (Array.isArray(next.content) && next.content.length > 0) {
        const children = await Promise.all(next.content.map(transformNode));
        next = { ...next, content: children };
      }

      return next;
    };

    const newData = await transformNode(data);
    cache.forEach((_, key) => {
      URL.revokeObjectURL(key);
    });
    return newData;
  };

  return { upload, tiptapContentUpload };
};

export default useUploadImage;
