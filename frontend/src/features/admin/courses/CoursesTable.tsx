import { ActionButton } from "@/components/ActionButton"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteCourse } from "@/features/admin/courses/hooks/useDeleteCourse"
import { useFetchAllCourses } from "@/features/admin/courses/hooks/useFetchAllCourses"
import useUser from "@/features/auth/useUser"
import { formatPlural } from "@/lib/utils"
import { Trash2Icon } from "lucide-react"
import { Link } from "react-router"


const CoursesTable = () => {

  const {userId} = useUser();
  
   const {data:courses, isFetching} = useFetchAllCourses(userId ?? ''); 
   const {mutate, isPending} = useDeleteCourse(); 
   const deleteCourse = (id: string)=>{
      mutate(id);
   }

   if(!courses){
    return null;
   }

   if(isFetching){
    return <Skeleton className="w-full h-[500px]"/>
   }
   return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {formatPlural(courses.length, {
              singular: "course",
              plural: "courses",
            })}
          </TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map(course => (
          <TableRow key={course.id}>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="font-semibold">{course.name}</div>
                <div className="text-muted-foreground">
                  {formatPlural(course.sectionsCount, {
                    singular: "section",
                    plural: "sections",
                  })}{" "}
                  •{" "}
                  {formatPlural(course.lessonsCount, {
                    singular: "lesson",
                    plural: "lessons",
                  })}
                </div>
              </div>
            </TableCell>
            <TableCell>{course.studentsCount}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to={`/admin/courses/${course.id}/edit`}>Edit</Link>
                </Button>
                <ActionButton
                  variant="destructive"
                  requireAreYouSure
                  action={()=> deleteCourse(course.id)}
                  isLoading={isPending}
                >
                  <Trash2Icon />
                  <span className="sr-only">Delete</span>
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
export default CoursesTable