import { Input } from "@/components/ui/input";
import { AsteriskIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import * as z from "zod";

import {
  Lesson,
  Section,
  LESSON_STATUSES,
} from "@/features/admin/courses/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLesson } from "@/features/admin/courses/hooks/useCreateLesson";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteSingleMediaByMetadata,
  uploadSingleMedia,
} from "@/features/mediaUpload/api";
import VideoPlayer from "@/components/VideoPlayer";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateLesson } from "@/features/admin/courses/hooks/useUpdateLesson";

export const lessonSchema = z.object({
  name: z.string().min(1, "Required"),
  section_id: z.string().min(1, "Required"),
  status: z.enum(LESSON_STATUSES),
  description: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable(),
  video_url: z.string().min(1, "Required"),
  video_public_id: z.string().min(1, "Required"),
});

interface Props {
  sections: Section[];
  defaultSectionId: string;
  lesson?: Lesson;
  onSuccess: () => void;
}
const LessonForm = ({
  sections,
  defaultSectionId,
  lesson,
  onSuccess,
}: Props) => {
  const { handleSubmit, control, formState, setValue, watch } = useForm<
    z.infer<typeof lessonSchema>
  >({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name ?? "",
      status: lesson?.status ?? "public",
      description: lesson?.description ?? "",
      section_id: lesson?.section_id ?? defaultSectionId,
      video_url: lesson?.video_url ?? "",
      video_public_id: lesson?.video_public_id ?? "",
    },
  });

  const { mutate: createLessonAction, isPending: isCreating } =
    useCreateLesson();
  const { mutate: updateLessonAction, isPending: isUpdating } =
    useUpdateLesson();

  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [video_url, video_public_id] = watch(["video_url", "video_public_id"]);

  const onSubmit = (values: z.infer<typeof lessonSchema>) => {
    if (lesson) {
      updateLessonAction(
        { id: lesson.id, data: values },
        {
          onSuccess: () => {
            toast.success("Lesson updated");
            onSuccess();
          },
        },
      );
    } else {
      createLessonAction(values, {
        onSuccess: () => {
          toast.success("Lesson created");
          onSuccess();
        },
      });
    }
  };

  const handleSingleLectureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("file", selectedFile);
    try {
      setIsVideoUploading(true);
      const data = await uploadSingleMedia(videoFormData);
      setValue("video_url", data.url);
      setValue("video_public_id", data.public_id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsVideoUploading(false);
    }
  };

  const resetVideo = () => {
    deleteSingleMediaByMetadata(video_public_id);
    setValue("video_url", "");
    setValue("video_public_id", "");
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1/2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 flex-col">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <AsteriskIcon className="text-destructive inline size-4 align-top" />
                  Name
                </FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="section_id"
            render={({ field }) => (
              <Field>
                <FieldLabel>Section</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <AsteriskIcon className="text-destructive inline size-4 align-top" />
                  Status
                </FieldLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="checkout-exp-month-ts6">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Description</FieldLabel>
                <Textarea {...field} value={field.value ?? ""} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {!video_url && (
            <Controller
              control={control}
              name="video_url"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <AsteriskIcon className="text-destructive inline size-4 align-top" />
                    Video file
                  </FieldLabel>
                  <Input
                    {...field}
                    type="file"
                    accept="video/*"
                    multiple={false}
                    onChange={handleSingleLectureUpload}
                    placeholder={isVideoUploading ? "Video Uploading" : ""}
                    disabled={isVideoUploading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <div className="self-end">
            <Button disabled={formState.isSubmitting} type="submit">
              {(isCreating || isUpdating) && <Spinner />}
              Save
            </Button>
          </div>
        </form>
      </div>
      {(video_url || isVideoUploading) && (
        <div className="flex-1/2">
          <div className="aspect-video">
            {isVideoUploading ? (
              <Skeleton className="aspect-video" />
            ) : (
              <>
                <VideoPlayer url={video_url} width="100%" height="200px" />
                <Button
                  className="mt-3"
                  variant="secondary"
                  type="button"
                  onClick={resetVideo}
                >
                  Change Video{" "}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default LessonForm;
