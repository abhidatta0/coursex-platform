import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_PURCHASE_URL = `${config.BACKEND_URL}/purchase`;

export const refundPurchase = async (purchaseId: string)=>{
  const {data}  = await apiClient.post(`${BASE_PURCHASE_URL}/refund/${purchaseId}`);
  return data;
}