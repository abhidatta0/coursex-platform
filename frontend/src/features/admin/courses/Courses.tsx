import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import CoursesTable from "@/features/admin/courses/CoursesTable";
import { Link } from "react-router";

const Courses = () => {
  return (
     <div className="my-6">
      <PageHeader title="Courses">
        <Button asChild>
          <Link to="new">New Course</Link>
        </Button>
      </PageHeader>
      <CoursesTable />
    </div>
  )
}
export default Courses;