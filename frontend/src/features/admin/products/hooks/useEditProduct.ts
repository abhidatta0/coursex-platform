import { updateProduct } from "@/features/admin/products/api";
import { CreateProductPayload } from "@/features/admin/products/types";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useEditProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProductPayload }) =>
      updateProduct(id, data),
    meta: {
      invalidateQuery: [QueryKeys.products],
    },
  });
};
