import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";
import { fetchPrevLessonId } from "../api";

const useFetchPrevOrNextLessonId = (
  direction: "prev" | "next",
  lessonId?: string,
) => {
  return useQuery({
    queryKey: [
      direction === "prev" ? QueryKeys.prevLessonId : QueryKeys.nextLessonId,
      lessonId ? lessonId : "",
    ],
    queryFn: () => fetchPrevLessonId(direction, lessonId ?? ""),
    enabled: !!lessonId,
  });
};

export default useFetchPrevOrNextLessonId;
