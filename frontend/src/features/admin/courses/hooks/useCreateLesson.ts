import { createlesson } from "@/features/admin/courses/api";
import {  CreateLessonPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data:CreateLessonPayload) => createlesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course] });
    },
  });
};