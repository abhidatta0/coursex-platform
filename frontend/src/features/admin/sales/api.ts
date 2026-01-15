import apiClient from "@/app/apiClient";
import config from "@/app/config";
import { AdminStats } from "./types";
import { Purchase } from "@/features/consumer/products/types";

const BASE_PURCHASE_URL = `${config.BACKEND_URL}/purchase`;
const BASE_USERS_URL = `${config.BACKEND_URL}/users`;

export const refundPurchase = async (purchaseId: string) => {
  const { data } = await apiClient.post(
    `${BASE_PURCHASE_URL}/refund/${purchaseId}`,
  );
  return data;
};

export const fetchBatchedUserInfo = async (userIds: string[]) => {
  const { data } = await apiClient.post<{ name: string; id: string }[]>(
    `${BASE_USERS_URL}/batchUserInfo`,
    { userIds },
  );
  return data;
};

export const fetchBatchedStats = async (userId: string) => {
  const { data } = await apiClient.get<AdminStats>(
    `${BASE_USERS_URL}/stats/${userId}`,
  );
  return data;
};

export const fetchSales = async (userId: string) => {
  const { data } = await apiClient.get<Purchase[]>(
    `${BASE_PURCHASE_URL}/sales/${userId}`,
  );
  return data;
};
