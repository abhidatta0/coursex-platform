import { PageHeader } from "@/components/PageHeader"
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchCourseById } from "@/features/admin/courses/hooks/useFetchCourseById";
import { useParams } from "react-router";


const CourseDetails = () => {
  const {courseId} = useParams();

  const {data: course} = useFetchCourseById(courseId ?? '',{publicOnly: true});
   
   if(!course){
    return <Skeleton className="w-full h-[500px]"/>
   }
  return (
     <div className="py-4">
        <PageHeader className="mb-2" title={course.name} />
        <p className="text-muted-foreground">{course.description}</p>
    </div>

  )
}
export default CourseDetails;