import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {Controller} from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PRODUCT_STATUSES, Product } from "./types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/custom/multi-select"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { AsteriskIcon } from "lucide-react";
import { CourseList } from "@/features/admin/courses/types";

export const productSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  image_url:  z.url().min(1, "Required"),
  image_public_id: z.string().min(1, "Required"),
  price_in_dollars: z.number().int().nonnegative(),
  status: z.enum(PRODUCT_STATUSES),
  course_ids: z.array(z.string()).min(1, "At least one course is required")
});

type Props = {
  product?: Product,
  courses:CourseList,
}
export function ProductForm({
  product,
  courses,
}: Props) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? {
      name: "",
      description: "",
      course_ids: [],
      image_url: "",
      image_public_id: "",
      price_in_dollars: 0,
      status: "private",
    },
  })

  const onSubmit = (values:z.infer<typeof productSchema>)=>{
    console.log(values)
  } 
 

  return (
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 items-start">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <AsteriskIcon className="text-destructive inline size-4 align-top"/>
                  Name
                </FieldLabel>
                <Input {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="price_in_dollars"
            render={({ field , fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                 <AsteriskIcon className="text-destructive inline size-4 align-top"/>
                  Price
                </FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    step={1}
                    min={0}
                    onChange={e =>
                      field.onChange(
                        isNaN(e.target.valueAsNumber)
                          ? ""
                          : e.target.valueAsNumber
                      )
                    }
                  />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="image_url"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <AsteriskIcon className="text-destructive inline size-4 align-top"/>
                  Image Url
                </FieldLabel>
                <Input {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
        <Controller
          control={form.control}
          name="course_ids"
          render={({ field , fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Included Courses</FieldLabel>
              <MultiSelect<CourseList[0]>
                selectPlaceholder="Select courses"
                searchPlaceholder="Search courses"
                options={courses}
                getLabel={c => c.name}
                getValue={c => c.id}
                selectedValues={field.value}
                onSelectedValuesChange={field.onChange}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <AsteriskIcon className="text-destructive inline size-4 align-top"/>
                Description
              </FieldLabel>
              <Textarea className="min-h-20 resize-none" {...field} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
  )
}