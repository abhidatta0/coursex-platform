import apiClient from "@/app/apiClient";
import config from "@/app/config";
import { Purchase } from "../products/types";

const BASE_STUDENT_PURCHASE_URL = `${config.BACKEND_URL}/student/purchase`;

export const fetchMyPurchases = async (userId: string) => {
  const { data } = await apiClient.get<Purchase[]>(
    `${BASE_STUDENT_PURCHASE_URL}/${userId}`,
  );
  return data;
};
