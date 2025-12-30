import { lessonUpdateCompletion } from "../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateLessonCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({userId,lessonId,complete}:{userId:string, lessonId:string, complete: boolean}) => lessonUpdateCompletion({userId,lessonId,complete}),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};