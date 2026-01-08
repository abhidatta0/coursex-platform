import { updateSection } from "@/features/admin/courses/api";
import {  CreateSectionPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useUpdateSection = () => {

  return useMutation({
    mutationFn: ({id, data}:{id: string, data:Partial<CreateSectionPayload>}) => updateSection(id,data),
    meta:{
      invalidateQuery: [QueryKeys.course] 
    }
  });
};