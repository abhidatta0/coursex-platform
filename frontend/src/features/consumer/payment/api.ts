import apiClient from "@/app/apiClient";
import config from "@/app/config";
import { FinalizePaymentPayload } from "./types";

const BASE_PURCHASE_URL = `${config.BACKEND_URL}/student/order`;

export const captureAndFinalizePayment = async (
  payload: FinalizePaymentPayload,
) => {
  const { data } = await apiClient.post(
    `${BASE_PURCHASE_URL}/capture`,
    payload,
  );
  return data;
};
