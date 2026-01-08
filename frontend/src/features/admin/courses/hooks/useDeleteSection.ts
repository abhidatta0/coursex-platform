import { deleteSection } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useDeleteSection = () => {

  return useMutation({
    mutationFn: (id:string) => deleteSection(id),
    meta:{
      invalidateQuery:[QueryKeys.course] 
    }
  });
};