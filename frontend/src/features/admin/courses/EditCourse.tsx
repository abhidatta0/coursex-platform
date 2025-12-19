import { PageHeader } from "@/components/PageHeader";
import { useParams } from "react-router"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchCourseById } from "@/features/admin/courses/hooks/useFetchCourseById";
import { EyeClosed, PlusIcon } from "lucide-react";
import CourseForm from "@/features/admin/courses/CourseForm";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { SectionFormDialog } from "@/features/admin/courses/components/sections/SectionFormDialog";
import SortableSectionList  from "@/features/admin/courses/components/sections/SortableSectionList";
import { cn } from "@/lib/utils";
import { LessonFormDialog } from "@/features/admin/courses/components/lessons/LessonFormDialog";
import SortableLessonList  from "@/features/admin/courses/components/lessons/SortableLessonList";
import { Skeleton } from "@/components/ui/skeleton";
const EditCourse = () => {
  const {courseId} = useParams();

  if(!courseId){
    return null;
  }

  const {data: course, isRefetching} = useFetchCourseById(courseId);

  if(!course){
    return null;
  }

  console.log({course});
  return (
    <div className="container my-6">
      <PageHeader title={course.name} />
      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons" className="flex flex-col gap-2">
          <Card>
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle>Sections</CardTitle>
              <SectionFormDialog courseId={course.id}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusIcon /> New Section
                  </Button>
                </DialogTrigger>
              </SectionFormDialog>
            </CardHeader>
            <CardContent>
              {
            isRefetching ? <Skeleton className="w-full h-[300px]"/>
           :
              <SortableSectionList courseId={course.id} sections={course.courseSections}/>
              }
            </CardContent>
          </Card>

          <hr className="my-4"/>
          {
            isRefetching ? <Skeleton className="w-full h-[300px]"/>
           :
          course.courseSections.map((section)=>(
             <Card key={section.id}>
            <CardHeader className="flex items-center flex-row justify-between gap-4">
              <CardTitle className={cn("flex items-center gap-2",section.status === 'private' && 'text-muted-background')}>{section.status === 'private' && <EyeClosed />}
                {section.name}
              </CardTitle>
              <LessonFormDialog defaultSectionId={section.id} sections={course.courseSections}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusIcon /> New Lesson
                  </Button>
                </DialogTrigger>
              </LessonFormDialog>
            </CardHeader>
            <CardContent>
              <SortableLessonList courseId={course.id} lessons={section.lessons} sections={course.courseSections}/>
            </CardContent>
          </Card>
          ))
          }
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CourseForm course={course} />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default EditCourse