import { updateCourse } from "@/features/admin/courses/api";
import { CreateCoursePayload } from "@/features/admin/courses/types";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useUpdateCourse = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCoursePayload>;
    }) => updateCourse(id, data),
    meta: {
      invalidateQuery: [QueryKeys.courses],
    },
  });
};
