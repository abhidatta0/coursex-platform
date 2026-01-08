import { createProduct } from "@/features/admin/products/api";
import { CreateProductPayload } from "@/features/admin/products/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useCreateProduct = () => {

  return useMutation({
    mutationFn: (data:CreateProductPayload) => createProduct(data),
    meta:{
      invalidateQuery: [QueryKeys.products] 
    }
  });
};