import { deleteCourse } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id:string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.courses] });
    },
  });
};