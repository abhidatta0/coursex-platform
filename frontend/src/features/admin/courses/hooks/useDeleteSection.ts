import { deleteSection } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id:string) => deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course] });
    },
  });
};