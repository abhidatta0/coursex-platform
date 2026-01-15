import { refundPurchase } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useRefundPurchase = () => {
  return useMutation({
    mutationFn: (purchaseId: string) => refundPurchase(purchaseId),
    meta: {
      invalidateQuery: [QueryKeys.purchases],
    },
  });
};
