import { Product } from "@/features/admin/products/types";
import apiClient from "@/app/apiClient";
import config from "@/app/config";
import { CheckUserOwnProductPayload, CreatePurchasePayload } from "./types";

const BASE_PRODUCT_URL = `${config.BACKEND_URL}/product`;
const BASE_PURCHASE_URL = `${config.BACKEND_URL}/student/order/create`;
const BASE_STUDENT_PRODUCT_URL = `${config.BACKEND_URL}/student/product`;

export const getAllProducts = async () => {
  const { data } = await apiClient.get<Product[]>(
    `${BASE_PRODUCT_URL}/publicOnly`,
  );
  return data;
};

export const completePurchaseService = async (
  payload: CreatePurchasePayload,
) => {
  const { data } = await apiClient.post(BASE_PURCHASE_URL, payload);
  return data;
};

export const userOwnsProduct = async (payload: CheckUserOwnProductPayload) => {
  const { data } = await apiClient.post<boolean>(
    `${BASE_STUDENT_PRODUCT_URL}/isProductOwned`,
    payload,
  );
  return data;
};
