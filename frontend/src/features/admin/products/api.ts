import { Course } from "@/features/admin/courses/types";
import { ProductList, 
    CreateProductPayload,
    Product,
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

export const createProduct = async (payload: CreateProductPayload) => {
    const {data} = await apiClient.post(`${BASE_PRODUCT_URL}`,payload);
    return data;
};

export const updateProduct = async (id: string,payload: CreateProductPayload) => {
    const {data} = await apiClient.put(`${BASE_PRODUCT_URL}/${id}`,payload);
    return data;
};

export const fetchProductById = async (id: string,params:{'sendNestedCourse': boolean})=>{
    const searchParams = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
    );

    const {data} = await apiClient.get<Product & {courseProducts: {course_id: string, course?:Course}[]}>(`${BASE_PRODUCT_URL}/${id}?${searchParams.toString()}`);
    return data;
}