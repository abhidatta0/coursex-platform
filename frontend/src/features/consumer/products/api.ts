import {  
    Product,
} from "@/features/admin/products/types";
import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";
import { CreatePurchasePayload } from "./types";

const BASE_PRODUCT_URL = `${config.BACKEND_URL}/product`;
const BASE_PURCHASE_URL = `${config.BACKEND_URL}/student/order/create`

export const getAllProducts = async () => {
    const {data} = await apiClient.get<Product[]>(`${BASE_PRODUCT_URL}/publicOnly`);
    return data;
};

export const completePurchaseService = async (payload: CreatePurchasePayload)=>{
    const {data} = await apiClient.post(BASE_PURCHASE_URL,payload);
    return data;
}