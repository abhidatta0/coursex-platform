import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"

import {Link} from "react-router"
import { useFetchUsersCourses } from "./hooks/useFetchUsersCourses"
import { Skeleton } from "@/components/ui/skeleton"

export default function Courses() {
  return (
    <div className="container my-6">
      <PageHeader title="My Courses" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
       <CourseGrid />
      </div>
    </div>
  )
}

function CourseGrid() {
  const {data: courses} = useFetchUsersCourses()

  if(!courses){
    return <Skeleton className="w-full h-[300px]"/>
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-start">
        You have no courses yet
        <Button asChild size="lg">
          <Link to="/">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return <p>Total courses bought : {courses.length}</p>
}



