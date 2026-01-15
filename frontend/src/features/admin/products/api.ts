import {
  ProductList,
  CreateProductPayload,
  ProductWithCourseData,
} from "@/features/admin/products/types";
import apiClient from "@/app/apiClient";
import config from "@/app/config";

const BASE_PRODUCT_URL = `${config.BACKEND_URL}/product`;

export const getAllProducts = async (userId: string) => {
  const { data } = await apiClient.get<ProductList>(
    `${BASE_PRODUCT_URL}/all/${userId}`,
  );
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await apiClient.delete(`${BASE_PRODUCT_URL}/${id}`);
  return data;
};

export const createProduct = async (payload: CreateProductPayload) => {
  const { data } = await apiClient.post(`${BASE_PRODUCT_URL}`, payload);
  return data;
};

export const updateProduct = async (
  id: string,
  payload: CreateProductPayload,
) => {
  const { data } = await apiClient.put(`${BASE_PRODUCT_URL}/${id}`, payload);
  return data;
};

export const fetchProductById = async (
  id: string,
  params: { sendNestedCourse: boolean },
) => {
  const searchParams = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  );

  const { data } = await apiClient.get<ProductWithCourseData>(
    `${BASE_PRODUCT_URL}/${id}?${searchParams.toString()}`,
  );
  return data;
};
