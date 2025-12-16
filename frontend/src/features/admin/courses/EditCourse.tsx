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
import { PlusIcon } from "lucide-react";
import CourseForm from "@/features/admin/courses/CourseForm";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { SectionFormDialog } from "@/features/admin/courses/components/SectionFormDialog";
import SortableSectionList  from "@/features/admin/courses/components/SortableSectionList";

const EditCourse = () => {
  const {courseId} = useParams();

  if(!courseId){
    return null;
  }

  const {data: course} = useFetchCourseById(courseId);

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
              <SortableSectionList courseId={course.id} sections={course.courseSections}/>
            </CardContent>
          </Card>
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