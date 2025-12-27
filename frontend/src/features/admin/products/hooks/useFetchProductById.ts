import { fetchProductById } from "@/features/admin/products/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchProductById = (id: string,{sendNestedCourse}:{sendNestedCourse: boolean}) => {

  return useQuery({
    queryKey: [QueryKeys.product,id],
    queryFn: () => fetchProductById(id,{sendNestedCourse}),
    enabled: !!id,
  });
};