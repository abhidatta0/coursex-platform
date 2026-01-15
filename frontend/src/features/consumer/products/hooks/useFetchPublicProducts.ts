import { getAllProducts } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchPublicProducts = () => {
  return useQuery({
    queryKey: [QueryKeys.products],
    queryFn: () => getAllProducts(),
  });
};
