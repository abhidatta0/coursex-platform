import { checkLessonUpdation } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCheckLessonUpdatePermission = (params: {
  userId?: string;
  lessonId?: string;
}) => {
  return useQuery({
    queryKey: [QueryKeys.checkLessonUpdatePermission, params.lessonId],
    queryFn: () =>
      checkLessonUpdation({
        userId: params.userId ?? "",
        lessonId: params.lessonId ?? "",
      }),
    enabled: !!params.userId && !!params.lessonId,
  });
};
