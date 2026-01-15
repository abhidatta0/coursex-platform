import { fetchCourseById } from "@/features/admin/courses/api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchCourseById = (
  id: string,
  { publicOnly }: { publicOnly: boolean },
) => {
  return useQuery({
    queryKey: [QueryKeys.course, id],
    queryFn: () => fetchCourseById(id, { publicOnly }),
    enabled: !!id,
  });
};
