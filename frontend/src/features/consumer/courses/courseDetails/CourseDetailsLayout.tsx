import { Skeleton } from "@/components/ui/skeleton";
import { useFetchCourseById } from "@/features/admin/courses/hooks/useFetchCourseById"
import { Outlet, useParams } from "react-router"
import CourseSidebar from "./CourseSidebar";

const CourseDetailsLayout = () => {

  const {courseId} = useParams();

  const {data: course} = useFetchCourseById(courseId ?? '',{publicOnly: true});

  if(!courseId) return null;

   if(!course){
    return <Skeleton className="w-full h-[500px]"/>
   }

  return (
    <div className="grid grid-cols-[300px_1fr] gap-8 container">
      <div className="py-4">
        <div className="text-lg font-semibold">{course.name}</div>
        <CourseSidebar course={course}/>
      </div>
      <Outlet />
    </div>
  )
}
export default CourseDetailsLayout