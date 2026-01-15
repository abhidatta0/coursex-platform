import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteCourse } from "@/features/admin/courses/hooks/useDeleteCourse";
import { useFetchAllCourses } from "@/features/admin/courses/hooks/useFetchAllCourses";
import useUser from "@/features/auth/useUser";
import { formatPlural } from "@/lib/utils";
import { EyeIcon, LockIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {
  CourseList,
  CourseStatus,
  CreateCoursePayload,
} from "@/features/admin/courses/types";
import { Badge } from "@/components/ui/badge";
import { useUpdateCourse } from "@/features/admin/courses/hooks/useUpdateCourse";
import { toast } from "sonner";

const CoursesTable = () => {
  const { userId } = useUser();

  const { data: courses, isFetching } = useFetchAllCourses(userId ?? "");
  const { mutate, isPending } = useDeleteCourse();
  const { mutate: updateCourse } = useUpdateCourse();

  const deleteCourse = (id: string) => {
    mutate(id);
  };

  const handleUpdate = (id: string, data: Partial<CreateCoursePayload>) => {
    updateCourse(
      { id, data: data },
      {
        onSuccess: (data) => {
          toast(`Course made ${data.status}`);
        },
      },
    );
  };

  if (!courses) {
    return null;
  }

  if (isFetching) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  const getDeleteAction = (course: CourseList[0]) => {
    return course.studentsCount === 0 ? "delete" : "archive";
  };

  return (
    <div>
      <Item variant="muted">
        <ItemHeader>Note about course:</ItemHeader>
        <ItemContent>
          <ItemTitle>Deletion</ItemTitle>
          <ItemDescription>
            A course can only be permanently deleted when no active student is
            enrolled
          </ItemDescription>
        </ItemContent>
      </Item>
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
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="font-semibold flex items-center gap-3">
                    {course.name}
                    {course.status === "private" && (
                      <Badge variant="outline">
                        {getStatusIcon(course.status)}
                      </Badge>
                    )}
                  </div>
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
                  {getDeleteAction(course) === "delete" && (
                    <ActionButton
                      variant="destructive"
                      requireAreYouSure
                      action={() => deleteCourse(course.id)}
                      isLoading={isPending}
                    >
                      <Trash2Icon />
                      <span className="sr-only">Delete</span>
                    </ActionButton>
                  )}
                  <Button
                    onClick={() =>
                      handleUpdate(course.id, {
                        status:
                          course.status === "public" ? "private" : "public",
                      })
                    }
                  >
                    Make {course.status === "public" ? "private" : "public"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default CoursesTable;

function getStatusIcon(status: CourseStatus) {
  const Icon = {
    public: EyeIcon,
    private: LockIcon,
  }[status];

  return <Icon className="size-4" />;
}
