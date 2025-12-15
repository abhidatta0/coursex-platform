import { PageHeader } from "@/components/PageHeader"
import CourseForm from "@/features/admin/courses/CourseForm"

const NewCourseCreate = () => {


  return (
   <div className="my-6">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  )
}
export default NewCourseCreate