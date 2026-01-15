import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";
import { fetchBatchedStats } from "../api";

const useFetchStats = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeys.stats, userId],
    queryFn: () => fetchBatchedStats(userId),
    enabled: !!userId,
    staleTime: 5000,
  });
};

export default useFetchStats;
