import { updateSection } from "@/features/admin/courses/api";
import {  CreateSectionPayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}:{id: string, data:Partial<CreateSectionPayload>}) => updateSection(id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.course] });
    },
  });
};