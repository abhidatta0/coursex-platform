import { fetchCourseById } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchCourseById = (id: string) => {

  return useQuery({
    queryKey: [QueryKeys.course,id],
    queryFn: () => fetchCourseById(id),
  });
};