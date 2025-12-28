import useUser from "@/features/auth/useUser";
import { getAllCoursesOfUser } from "../api";
import QueryKeys from "@/lib/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchUsersCourses = () => {

  const {userId} = useUser();
  return useQuery({
    queryKey: [QueryKeys.consumerCourses],
    queryFn: () => getAllCoursesOfUser(userId ?? ''),
    enabled: !!userId,
  });
};