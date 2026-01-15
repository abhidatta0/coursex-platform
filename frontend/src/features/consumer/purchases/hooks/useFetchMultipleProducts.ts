import { fetchProductById } from "@/features/admin/products/api";
import QueryKeys from "@/app/QueryKeys";
import { useQueries } from "@tanstack/react-query";

export const useFetchMultipleProducts = (productIds: string[]) => {
  return useQueries({
    queries: productIds.map((id) => ({
      queryKey: [QueryKeys.products, id],
      queryFn: () => fetchProductById(id, { sendNestedCourse: false }),
      enabled: !!id,
    })),
  });
};
