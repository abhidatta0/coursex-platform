import { deleteLesson } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id:string) => deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course] });
    },
  });
};