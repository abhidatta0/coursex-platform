import { MediaUploadResponse } from "@/features/mediaUpload/types";
import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_MEDIA_UPLOAD_URL = `${config.BACKEND_URL}/media`;

export const uploadSingleMedia = async (formData: FormData) => {
  const { data } = await apiClient.post<MediaUploadResponse>(
    `${BASE_MEDIA_UPLOAD_URL}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
};

export const deleteSingleMediaByMetadata = async (publicId: string) => {
  const { data } = await apiClient.post<string>(
    `${BASE_MEDIA_UPLOAD_URL}/delete`,
    { publicId },
  );
  return data;
};
