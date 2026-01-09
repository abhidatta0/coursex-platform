import { Link, useParams } from "react-router";
import { useFetchLesson } from "../hooks/useFetchLesson";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/VideoPlayer";
import useUser from "@/features/auth/useUser";
import { useCheckLessonAccess } from "../hooks/useCheckLessonAccess";
import { CheckSquare2Icon, LockIcon, XSquareIcon } from "lucide-react";
import { useCheckLessonComplete } from "../hooks/useCheckLessonComplete";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ActionButton";
import { useCheckLessonUpdatePermission } from "../hooks/useCheckLessonUpdatePermission";
import { useUpdateLessonCompletion } from "../hooks/useUpdateLessonCompletion";
import { toast } from "sonner";
import { ReactNode } from "react";
import useFetchPrevOrNextLessonId from "../hooks/useFetchPrevOrNextLessonId";
import { Spinner } from "@/components/ui/spinner";

const Lesson = () => {
  const { lessonId, courseId } = useParams();

  const { data: lesson } = useFetchLesson(lessonId);

  const { userId } = useUser();

  const { data: lessonAccess, isLoading: isCheckingAccess } =
    useCheckLessonAccess({ lessonId: lesson?.id, userId });

  const { data: isLessonComplete, isFetching: isLessonCompleteFetching } =
    useCheckLessonComplete({ lessonId: lesson?.id, userId });

  const {
    data: canUpdateCompletionStatus,
    isFetching: canUpdateCompletionStatusFetching,
  } = useCheckLessonUpdatePermission({ lessonId: lesson?.id, userId });

  const { mutate: updateLessonCompletionAction, isPending: isMarking } =
    useUpdateLessonCompletion();

  const { data: prevLessonId } = useFetchPrevOrNextLessonId("prev", lesson?.id);
  const { data: nextLessonId } = useFetchPrevOrNextLessonId("next", lesson?.id);

  if (!courseId || !lessonId) {
    return null;
  }

  if (!lesson || !userId) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  const onVideoEnded = () => {
    if (isLessonCompleteFetching || canUpdateCompletionStatusFetching) {
      return;
    }

    if (isLessonComplete == false && canUpdateCompletionStatus) {
      updateLessonCompletion(true);
    }
  };

  const updateLessonCompletion = (complete: boolean, showToast?: boolean) => {
    updateLessonCompletionAction(
      { lessonId: lesson.id, userId: userId, complete: complete },
      {
        onSuccess: () => {
          if (showToast) {
            toast.success(
              `Lesson marked ${complete ? "Completed" : "Incomplete"}`,
            );
          }
        },
      },
    );
  };

  const canView = !!lessonAccess;
  return (
    <div className="my-4 flex flex-col gap-4">
      <div className="aspect-video">
        {isCheckingAccess ? (
          <Skeleton />
        ) : canView ? (
          <VideoPlayer
            url={lesson.video_url}
            width="100%"
            height="90%"
            onVideoEnded={onVideoEnded}
          />
        ) : (
          <div className="flex items-center justify-center bg-primary text-primary-foreground h-full w-full">
            <LockIcon className="size-16" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-semibold">{lesson.name}</h1>
          <div className="flex gap-2 justify-end">
            <PreviousNextLessonButton
              courseId={courseId}
              toLessonId={prevLessonId}
            >
              Previous
            </PreviousNextLessonButton>
            {canUpdateCompletionStatus && (
              <ActionButton
                action={() => updateLessonCompletion(!isLessonComplete, true)}
                variant={"outline"}
                isLoading={isMarking}
              >
                <div className="flex gap-2 items-center">
                  {isLessonComplete ? (
                    <>
                      <XSquareIcon /> Mark Incomplete
                    </>
                  ) : (
                    <>
                      <CheckSquare2Icon /> Mark Complete
                    </>
                  )}
                </div>
              </ActionButton>
            )}

            <PreviousNextLessonButton
              courseId={courseId}
              toLessonId={nextLessonId}
            >
              Next
            </PreviousNextLessonButton>
          </div>
        </div>
        {canView ? (
          lesson.description && <p>{lesson.description}</p>
        ) : (
          <p>This lesson is locked. Please purchase the course to view it.</p>
        )}
      </div>
    </div>
  );
};
export default Lesson;

interface Props {
  toLessonId: string | null | undefined;
  children: ReactNode;
  courseId: string;
}
function PreviousNextLessonButton({ toLessonId, children, courseId }: Props) {
  let jsx = null,
    className = "";
  if (toLessonId === undefined) {
    jsx = <Spinner />;
    className = "pointer-events-none opacity-50";
  } else {
    jsx = children;
    if (toLessonId === null) {
      className = "pointer-events-none opacity-50";
    }
  }
  return (
    <Button
      variant="outline"
      asChild
      disabled={!toLessonId}
      className={className}
    >
      <Link to={`/courses/${courseId}/lessons/${toLessonId}`}>{jsx}</Link>
    </Button>
  );
}
