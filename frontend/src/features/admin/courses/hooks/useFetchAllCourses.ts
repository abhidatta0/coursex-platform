import { getAllCourses } from "@/features/admin/courses/api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllCourses = () => {

  return useQuery({
    queryKey: [QueryKeys.courses],
    queryFn: () => getAllCourses(),
  });
};