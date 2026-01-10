import { fetchSales } from "../api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchSales = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeys.sales, userId],
    queryFn: () => fetchSales(userId),
    enabled: !!userId,
  });
};
