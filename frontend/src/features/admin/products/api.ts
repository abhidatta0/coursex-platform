import { ProductList, 
} from "@/features/admin/products/types";
import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_PRODUCT_URL = `${config.BACKEND_URL}/product`;

export const getAllProducts = async () => {
    const {data} = await apiClient.get<ProductList>(BASE_PRODUCT_URL);
    return data;
};

export const deleteProduct = async (id: string) => {
    const {data} = await apiClient.delete(`${BASE_PRODUCT_URL}/${id}`);
    return data;
};

