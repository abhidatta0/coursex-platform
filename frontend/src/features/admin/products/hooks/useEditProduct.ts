import { updateProduct } from "@/features/admin/products/api";
import { CreateProductPayload } from "@/features/admin/products/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}:{id: string,data:CreateProductPayload}) => updateProduct(id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.products] });
    },
  });
};