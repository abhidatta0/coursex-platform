import {  
    Product,
} from "@/features/admin/products/types";
import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_PRODUCT_URL = `${config.BACKEND_URL}/product`;

export const getAllProducts = async () => {
    const {data} = await apiClient.get<Product[]>(`${BASE_PRODUCT_URL}/publicOnly`);
    return data;
};
