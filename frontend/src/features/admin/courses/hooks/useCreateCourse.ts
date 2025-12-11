import { createCourse } from "@/features/admin/courses/api";
import { CreateCoursePayload } from "@/features/admin/courses/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data:CreateCoursePayload) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.courses] });
    },
  });
};