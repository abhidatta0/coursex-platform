import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PRODUCT_STATUSES, Product } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/custom/multi-select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AsteriskIcon } from "lucide-react";
import { CourseList } from "@/features/admin/courses/types";
import {
  deleteSingleMediaByMetadata,
  uploadSingleMedia,
} from "@/features/mediaUpload/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateProduct } from "@/features/admin/products/hooks/useCreateProduct";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useEditProduct } from "@/features/admin/products/hooks/useEditProduct";
import { useNavigate } from "react-router";
import useUser from "@/features/auth/useUser";
import { Badge } from "@/components/ui/badge";

export const productSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  image_url: z.url().min(1, "Required"),
  image_public_id: z.string().min(1, "Required"),
  price_in_dollars: z.number().int().nonnegative(),
  status: z.enum(PRODUCT_STATUSES),
  course_ids: z.array(z.string()).min(1, "At least one course is required"),
});

interface Props {
  product?: Product & { course_ids: string[] };
  courses: CourseList;
}
export function ProductForm({ product, courses }: Props) {
  const { userId } = useUser();
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
  });

  const { mutateAsync: createAction, isPending: isCreatePending } =
    useCreateProduct();
  const { mutateAsync: editAction, isPending: isEditPending } =
    useEditProduct();

  const navigate = useNavigate();

  const [isImageUploading, setIsImageUploading] = useState(false);

  const { setValue, watch } = form;
  const [image_public_id, image_url] = watch(["image_public_id", "image_url"]);

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    if (!userId) return;
    if (product) {
      await editAction(
        { data: { ...values, author_ids: [userId] }, id: product.id },
        {
          onSuccess: () => {
            toast("Product updated");
          },
        },
      );
    } else {
      await createAction(
        { ...values, author_ids: [userId] },
        {
          onSuccess: () => {
            toast("Product created");
          },
        },
      );
    }
    navigate(-1);
  };

  const handleProductImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const imageFormData = new FormData();
    imageFormData.append("file", selectedFile);
    try {
      setIsImageUploading(true);
      const data = await uploadSingleMedia(imageFormData);
      setValue("image_url", data.url, { shouldValidate: true });
      setValue("image_public_id", data.public_id, { shouldValidate: true });
    } catch (error) {
      console.error(error);
    } finally {
      setIsImageUploading(false);
    }
  };

  const resetImage = () => {
    deleteSingleMediaByMetadata(image_public_id);
    setValue("image_url", "", { shouldValidate: true });
    setValue("image_public_id", "", { shouldValidate: true });
  };

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
                <AsteriskIcon className="text-destructive inline size-4 align-top" />
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
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <AsteriskIcon className="text-destructive inline size-4 align-top" />
                Price
              </FieldLabel>
              <Input
                type="number"
                {...field}
                step={1}
                min={0}
                onChange={(e) =>
                  field.onChange(
                    isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber,
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
                <AsteriskIcon className="text-destructive inline size-4 align-top" />
                Image Url
              </FieldLabel>
              {image_url || isImageUploading ? (
                <div className="flex-1/2">
                  <div>
                    {isImageUploading ? (
                      <Skeleton className="aspect-video" />
                    ) : (
                      <>
                        <img src={image_url} className="w-[200px] h-[150px]" />
                        <Button
                          className="mt-3"
                          variant="secondary"
                          type="button"
                          onClick={resetImage}
                        >
                          Change Image{" "}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Input
                  {...field}
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={handleProductImageUpload}
                  disabled={isImageUploading}
                />
              )}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STATUSES.map((status) => (
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
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              <AsteriskIcon className="text-destructive inline size-4 align-top" />
              Included Courses
            </FieldLabel>
            <MultiSelect<CourseList[0]>
              selectPlaceholder="Select courses"
              searchPlaceholder="Search courses"
              options={courses}
              getLabel={(c) => (
                <p>
                  {c.name}{" "}
                  {c.status === "private" && (
                    <Badge variant="outline">Private</Badge>
                  )}
                </p>
              )}
              getValue={(c) => c.id}
              selectedValues={field.value}
              onSelectedValuesChange={field.onChange}
              optionDisabled={(option) => option.status === "private"}
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
              <AsteriskIcon className="text-destructive inline size-4 align-top" />
              Description
            </FieldLabel>
            <Textarea className="min-h-20 resize-none" {...field} />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <div className="self-end">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {(isCreatePending || isEditPending) && <Spinner />}
          Save
        </Button>
      </div>
    </form>
  );
}
