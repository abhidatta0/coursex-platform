import useUser from "@/features/auth/useUser";
import { getAllProducts } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllProducts = () => {
  const { userId } = useUser();
  return useQuery({
    queryKey: [QueryKeys.products],
    queryFn: () => getAllProducts(userId ?? ""),
    enabled: !!userId,
  });
};
