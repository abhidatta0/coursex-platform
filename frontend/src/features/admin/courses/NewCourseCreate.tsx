import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button";
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm , Controller} from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { z } from "zod"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AsteriskIcon } from "lucide-react";
import { useCreateCourse } from "@/features/admin/courses/hooks/useCreateCourse";
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner";

export const courseSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

const NewCourseCreate = () => {
  const {handleSubmit, control, formState} = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues:  {
      name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useCreateCourse();


  const onSubmit = (values: z.infer<typeof courseSchema>)=>{
    mutate(values,{
      onSuccess:()=>{
        toast.success("Course Created");
      }
    });
  }

  return (
   <div className="my-6">
      <PageHeader title="New Course" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <Controller
          control={control}
          name="name"
          render={({ field , fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <AsteriskIcon className="text-destructive inline size-4 align-top"/>
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
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <AsteriskIcon className="text-destructive inline size-4 align-top"/>
                Description
              </FieldLabel>
              <Textarea className="min-h-20 resize-none" {...field} />
               {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <div className="self-end">
          <Button disabled={formState.isSubmitting} type="submit">
            {isPending && <Spinner />}
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
export default NewCourseCreate