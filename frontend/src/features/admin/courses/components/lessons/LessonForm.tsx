import { Input } from "@/components/ui/input";
import { AsteriskIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button";
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm , Controller} from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import * as z from 'zod';

import { Lesson, Section, SECTION_STATUSES } from "@/features/admin/courses/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSection } from "@/features/admin/courses/hooks/useCreateSection";
import { toast } from "sonner";

export const lessonSchema = z.object({
  name: z.string().min(1, "Required"),
  section_id: z.string().min(1, "Required"),
  status: z.enum(SECTION_STATUSES),
  description: z.string().transform(v=> (v.trim() === '' ? null : v)).nullable()
});

type Props = {
    sections: Section[],
    defaultSectionId: string,
    lesson?:Lesson,
    onSuccess: ()=> void,
}
const LessonForm = ({sections,defaultSectionId, lesson, onSuccess}:Props) => {
    const {handleSubmit, control, formState} = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues:  {
      name: lesson?.name ?? '',
      status: lesson?.status ?? "public",
      description: lesson?.description ?? '',
      section_id : lesson?.section_id ?? defaultSectionId,
    },
  });

  const {mutate: createSectionAction, isPending: isCreating} = useCreateSection();



  // const onSubmit = (values: z.infer<typeof lessonSchema>)=>{
  //    console.log({values});

  //    createSectionAction(values,{
  //      onSuccess:()=>{
  //       toast.success("Section created");
  //       onSuccess();
  //      }
  //    })
     
  // }
  
  return (
   <form
        // onSubmit={handleSubmit(onSubmit)}
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
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <AsteriskIcon className="text-destructive inline size-4 align-top"/>
                Status
              </FieldLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="checkout-exp-month-ts6">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTION_STATUSES.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
              </Select>
               {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <div className="self-end">
          <Button disabled={formState.isSubmitting} type="submit">
            {isCreating && <Spinner />}
            Save
          </Button>
        </div>
      </form>
  )
}
export default LessonForm;