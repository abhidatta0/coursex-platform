import { deleteLesson } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useDeleteLesson = () => {

  return useMutation({
    mutationFn: (id:string) => deleteLesson(id),
    meta:{
      invalidateQuery:[QueryKeys.course] 
    }
  });
};