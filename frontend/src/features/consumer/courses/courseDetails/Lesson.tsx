import { Link, useParams } from "react-router"
import { useFetchLesson } from "../hooks/useFetchLesson";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/VideoPlayer";
import useUser from "@/features/auth/useUser";
import { useCheckLessonAccess } from "../hooks/useCheckLessonAccess";
import { CheckSquare2Icon, LockIcon, XSquareIcon } from "lucide-react";
import { useCheckLessonComplete } from "../hooks/useCheckLessonComplete";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ActionButton";

const Lesson = () => {
  const {lessonId, courseId} = useParams();

  if(!courseId || !lessonId){
    return null;
  }
  const {data: lesson} = useFetchLesson(lessonId);

  const {userId} = useUser();

  const {data:lessonAccess, isLoading: isCheckingAccess} = useCheckLessonAccess({lessonId: lesson?.id, userId});

  const {data:isLessonComplete} = useCheckLessonComplete({lessonId: lesson?.id, userId});

  if(!lesson || !userId){
    return <Skeleton className="w-full h-[500px]"/>
  }


  const canView = !!lessonAccess;
  return (
    <div className="my-4 flex flex-col gap-4">
      <div className="aspect-video">
        {isCheckingAccess ? <Skeleton /> : canView ? (
          <VideoPlayer
            url={lesson.video_url} width="100%" height="90%"
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
              <Button variant="outline" asChild>
                <Link to={`/courses/${courseId}/lessons/`}>
                  Previous
                </Link>
              </Button>
              <ActionButton action={()=> null} variant={'outline'} isLoading={false}>
                <div className="flex gap-2 items-center">
                 {
                  !!isLessonComplete ? <>
                    <CheckSquare2Icon /> Mark Incomplete
                  </> : <>
                    <XSquareIcon /> Mark Complete
                  </>
                 }
                 </div>
              </ActionButton>
              <Button variant="outline" asChild>
                <Link to={`/courses/${courseId}/lessons/`}>
                  Previous
                </Link>
              </Button>
          </div>
        </div>
        {canView ? (
          lesson.description && <p>{lesson.description}</p>
        ) : (
          <p>This lesson is locked. Please purchase the course to view it.</p>
        )}
      </div>
    </div>
  )
}
export default Lesson;