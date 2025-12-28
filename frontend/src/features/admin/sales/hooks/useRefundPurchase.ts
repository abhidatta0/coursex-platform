import { refundPurchase } from "../api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useRefundPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchaseId: string) => refundPurchase(purchaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.purchases] });
    },
  });
};