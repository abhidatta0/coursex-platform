import { fetchMyPurchases } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchPurchases = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeys.purchases, userId],
    queryFn: () => fetchMyPurchases(userId),
    enabled: !!userId,
  });
};
