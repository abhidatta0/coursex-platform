import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AsteriskIcon } from "lucide-react";
import { useCreateCourse } from "@/features/admin/courses/hooks/useCreateCourse";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { z } from "zod";
import { Course } from "@/features/admin/courses/types";
import { useUpdateCourse } from "@/features/admin/courses/hooks/useUpdateCourse";
import { useNavigate } from "react-router";
import useUser from "@/features/auth/useUser";

export const courseSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

interface Props {
  course?: Course;
}
const CourseForm = ({ course }: Props) => {
  const navigate = useNavigate();
  const { handleSubmit, control, formState } = useForm<
    z.infer<typeof courseSchema>
  >({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      name: "",
      description: "",
    },
  });

  const { mutate: createCourse, isPending: isCreatePending } =
    useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdatePending } =
    useUpdateCourse();

  const { userId } = useUser();

  const onSubmit = (values: z.infer<typeof courseSchema>) => {
    if (!userId) return;
    if (course) {
      updateCourse(
        { id: course.id, data: { ...values, author_ids: [userId] } },
        {
          onSuccess: () => {
            toast.success("Course Updated");
          },
        },
      );
    } else {
      createCourse(
        { ...values, author_ids: [userId] },
        {
          onSuccess: () => {
            toast.success("Course Created");
            navigate(-1);
          },
        },
      );
    }
  };
  return (
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              <AsteriskIcon className="text-destructive inline size-4 align-top" />
              Description
            </FieldLabel>
            <Textarea className="min-h-20 resize-none" {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="self-end">
        <Button disabled={formState.isSubmitting} type="submit">
          {(isCreatePending || isUpdatePending) && <Spinner />}
          Save
        </Button>
      </div>
    </form>
  );
};
export default CourseForm;
