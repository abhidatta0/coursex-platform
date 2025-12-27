import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";
import { Purchase } from "../products/types";

const BASE_PURCHASE_URL = `${config.BACKEND_URL}/purchase`;

export const fetchMyPurchases = async (userId: string)=>{
  const {data}  = await apiClient.get<Purchase[]>(`${BASE_PURCHASE_URL}/${userId}`);
  return data;
}