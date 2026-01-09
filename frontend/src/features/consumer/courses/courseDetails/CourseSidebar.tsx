import { Course } from "@/features/admin/courses/types";
import { Link, useLocation, useParams } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchCompletedLessons } from "../hooks/useFetchCompletedLessons";
import useUser from "@/features/auth/useUser";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

function mapCourse(course: Course, completedLessonIds: string[]) {
  return {
    ...course,
    courseSections: course.courseSections.map((section) => {
      return {
        ...section,
        lessons: section.lessons.map((lesson) => {
          return {
            ...lesson,
            isComplete: completedLessonIds.includes(lesson.id),
          };
        }),
      };
    }),
  };
}

interface Props {
  course: Course;
}
const CourseSidebar = ({ course }: Props) => {
  const { lessonId } = useParams();
  const location = useLocation();

  const [selectedSection, setSelectedSection] = useState(
    course.courseSections[0]?.id ?? "",
  );

  useEffect(() => {
    const newDefaultValue =
      typeof lessonId === "string"
        ? course.courseSections.find((section) =>
            section.lessons.find((lesson) => lesson.id === lessonId),
          )
        : course.courseSections[0];
    if (newDefaultValue) {
      setSelectedSection(newDefaultValue.id);
    }
  }, [location, course.courseSections, lessonId]);

  const { userId } = useUser();

  const { data: completedLessons } = useFetchCompletedLessons(userId ?? "");

  if (!completedLessons) {
    return <Spinner className="mt-4" />;
  }

  const processedCourse = mapCourse(course, completedLessons);

  return (
    <Accordion
      type="single"
      value={selectedSection}
      onValueChange={(v) => setSelectedSection(v)}
    >
      {processedCourse.courseSections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="text-lg">
            {section.name}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            {section.lessons.map((lesson) => (
              <Button
                variant="ghost"
                asChild
                key={lesson.id}
                className={cn(
                  "justify-start",
                  lesson.id === lessonId && "bg-primary/75 text-accent",
                )}
              >
                <Link to={`/courses/${course.id}/lessons/${lesson.id}`}>
                  <VideoIcon />
                  {lesson.name}
                  {lesson.isComplete && (
                    <CheckCircle2Icon className="ml-auto" />
                  )}
                </Link>
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
export default CourseSidebar;
