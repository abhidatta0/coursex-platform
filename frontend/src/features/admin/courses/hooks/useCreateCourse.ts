import { createCourse } from "@/features/admin/courses/api";
import { CreateCoursePayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useCreateCourse = () => {

  return useMutation({
    mutationFn: (data:CreateCoursePayload) => createCourse(data),
    meta:{
      invalidateQuery: [QueryKeys.courses] 
    }
  });
};