import { createSection } from "@/features/admin/courses/api";
import {  CreateSectionPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data:CreateSectionPayload) => createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.courses] });
    },
  });
};