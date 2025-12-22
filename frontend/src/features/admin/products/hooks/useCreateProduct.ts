import { createProduct } from "@/features/admin/products/api";
import { CreateProductPayload } from "@/features/admin/products/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data:CreateProductPayload) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.products] });
    },
  });
};