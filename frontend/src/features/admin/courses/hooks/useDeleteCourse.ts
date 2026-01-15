import { deleteCourse } from "@/features/admin/courses/api";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    meta: {
      invalidateQuery: [QueryKeys.courses],
    },
  });
};
