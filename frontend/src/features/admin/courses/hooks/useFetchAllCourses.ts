import { getAllCourses } from "@/features/admin/courses/api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllCourses = (userId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.courses],
    queryFn: () => getAllCourses(userId ?? ""),
    enabled: !!userId,
  });
};
