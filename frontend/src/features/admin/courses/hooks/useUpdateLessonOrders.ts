import { updateLessonOrder } from "@/features/admin/courses/api";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useUpdateLessonOrders = (id: string) => {
  return useMutation({
    mutationFn: (ids: string[]) => updateLessonOrder(ids),
    meta: {
      invalidateQuery: [QueryKeys.course, id],
    },
  });
};
