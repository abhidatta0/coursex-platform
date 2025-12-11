import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Courses = () => {
  return (
     <div className="my-6">
      <PageHeader title="Courses">
        <Button asChild>
          <Link to="new">New Course</Link>
        </Button>
      </PageHeader>
    </div>
  )
}
export default Courses;