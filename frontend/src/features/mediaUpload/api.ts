import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_MEDIA_UPLOAD_URL = `${config.BACKEND_URL}/media/upload`;

export const uploadSingleMedia = async (formData: FormData) => {
    const {data} = await apiClient.post<MediaUploadResponse>(BASE_MEDIA_UPLOAD_URL,formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    });
    return data;
};