import { updateLesson } from "@/features/admin/courses/api";
import {  CreateLessonPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string,data:Partial<CreateLessonPayload>}) => updateLesson(id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course] });
    },
  });
};