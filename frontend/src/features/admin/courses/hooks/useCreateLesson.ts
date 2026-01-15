import { createlesson } from "@/features/admin/courses/api";
import { CreateLessonPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useCreateLesson = () => {
  return useMutation({
    mutationFn: (data: CreateLessonPayload) => createlesson(data),
    meta: {
      invalidateQuery: [QueryKeys.course],
    },
  });
};
