import { getLessonDetails } from "../api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchLesson = (id?: string) => {
  return useQuery({
    queryKey: [QueryKeys.lesson, id],
    queryFn: () => getLessonDetails(id ?? ""),
    enabled: !!id,
  });
};
