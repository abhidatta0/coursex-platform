import { createSection } from "@/features/admin/courses/api";
import {  CreateSectionPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useCreateSection = () => {

  return useMutation({
    mutationFn: (data:CreateSectionPayload) => createSection(data),
    meta:{
      invalidateQuery: [QueryKeys.course]
    }
  });
};