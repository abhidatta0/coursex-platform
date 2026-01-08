import { updateSectionOrder } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useUpdateSectionOrders = (id: string) => {

  return useMutation({
    mutationFn: (ids:string[]) => updateSectionOrder(ids),
    meta:{
      invalidateQuery: [QueryKeys.course, id] 
    }
  });
};