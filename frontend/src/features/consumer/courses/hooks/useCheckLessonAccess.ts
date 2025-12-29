import { checkLessonAccess } from "../api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCheckLessonAccess = (params:{userId?:string, lessonId?:string}) => {

  return useQuery({
    queryKey: [QueryKeys.lessonAccess,params.lessonId],
    queryFn: () => checkLessonAccess({userId: params.userId ?? '',lessonId: params.lessonId ?? ''}),
    enabled: !!params.userId && !!params.lessonId
  });
};