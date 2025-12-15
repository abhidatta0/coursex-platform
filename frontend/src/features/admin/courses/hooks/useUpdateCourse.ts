import { updateCourse } from "@/features/admin/courses/api";
import { CreateCoursePayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateCourse = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}:{id: string, data:CreateCoursePayload}) => updateCourse(id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course, id] });
    },
  });
};