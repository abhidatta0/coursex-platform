import { getCompletedLessonsOfUser } from "../api";
import QueryKeys from "@/app/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useFetchCompletedLessons = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeys.completedLessons, userId],
    queryFn: () => getCompletedLessonsOfUser(userId),
    enabled: !!userId,
  });
};
