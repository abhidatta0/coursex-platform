import { deleteProduct } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    meta: {
      invalidateQuery: [QueryKeys.products],
    },
  });
};
