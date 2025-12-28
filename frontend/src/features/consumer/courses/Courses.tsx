import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"

import {Link} from "react-router"
import { useFetchUsersCourses } from "./hooks/useFetchUsersCourses"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPlural } from "@/lib/utils"

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

  return courses.map(course => (
    <Card key={course.id} className="overflow-hidden flex flex-col pb-0">
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>
          {formatPlural(course.sectionsCount, {
            plural: "sections",
            singular: "section",
          })}{" "}
          •{" "}
          {formatPlural(course.lessonsCount, {
            plural: "lessons",
            singular: "lesson",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="line-clamp-3" title={course.description}>
        {course.description}
      </CardContent>
      <div className="grow" />
      <CardFooter>
        <Button asChild>
          <Link to={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
      <div
        className="bg-primary h-2 mt-2"
        style={{
          width: course.lessonsCount > 0 ? `${(course.lessonsComplete / course.lessonsCount) * 100}%`: '0%',
        }}
      />
    </Card>))
}



