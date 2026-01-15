import { updateLesson } from "@/features/admin/courses/api";
import { CreateLessonPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useUpdateLesson = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateLessonPayload>;
    }) => updateLesson(id, data),

    meta: {
      invalidateQuery: [QueryKeys.course],
    },
  });
};
