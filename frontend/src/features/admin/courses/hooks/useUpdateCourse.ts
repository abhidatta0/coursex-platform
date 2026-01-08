import { updateCourse } from "@/features/admin/courses/api";
import { CreateCoursePayload } from "@/features/admin/courses/types";
import QueryKeys from "@/lib/app/QueryKeys";
import { useMutation } from "@tanstack/react-query";

export const useUpdateCourse = (id: string) => {

  return useMutation({
    mutationFn: ({id, data}:{id: string, data:CreateCoursePayload}) => updateCourse(id,data),
    meta:{
      invalidateQuery: [QueryKeys.course, id] 
    }
  });
};