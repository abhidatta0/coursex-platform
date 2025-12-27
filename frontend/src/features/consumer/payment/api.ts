import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";
import { FinalizePaymentPayload } from "./types";

const BASE_PURCHASE_URL = `${config.BACKEND_URL}/student/order`



export const captureAndFinalizePayment = async (payload: FinalizePaymentPayload)=>{
  const response  = await apiClient.post(`${BASE_PURCHASE_URL}/capture`, payload);
  return response;
}