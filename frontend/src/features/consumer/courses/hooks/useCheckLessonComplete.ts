import { checkLessonIsCompleted } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCheckLessonComplete = (params: {
  userId?: string;
  lessonId?: string;
}) => {
  return useQuery({
    queryKey: [QueryKeys.lessonComplete, params.lessonId],
    queryFn: () =>
      checkLessonIsCompleted({
        userId: params.userId ?? "",
        lessonId: params.lessonId ?? "",
      }),
    enabled: !!params.userId && !!params.lessonId,
  });
};
