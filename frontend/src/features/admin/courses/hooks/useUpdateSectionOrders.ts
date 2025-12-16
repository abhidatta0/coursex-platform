import { updateSectionOrder } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateSectionOrders = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids:string[]) => updateSectionOrder(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course, id] });
    },
  });
};