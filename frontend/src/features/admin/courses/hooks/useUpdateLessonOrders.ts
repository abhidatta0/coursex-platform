import { updateLessonOrder } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateLessonOrders = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids:string[]) => updateLessonOrder(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course, id] });
    },
  });
};