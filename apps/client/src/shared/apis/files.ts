import { http } from "../configs/api";

interface IUploadImageResp {
  url: string;
}

export default {
  uploadImage: (file: File) => {
    const data = new FormData();
    data.append("file", file);
    return {
      request: http.post<IUploadImageResp>,
      path: "files/image",
      body: data,
    };
  },
};
