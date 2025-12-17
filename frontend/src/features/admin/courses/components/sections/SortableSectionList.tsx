"use client"

import SortableList , { SortableItem } from "@/components/SortableList"
import { Section } from "@/features/admin/courses/types";
import { cn } from "@/lib/utils"
import { EyeClosed, Trash2Icon } from "lucide-react"
import { SectionFormDialog } from "./SectionFormDialog"
import { Button } from "@/components/ui/button"
import { ActionButton } from "@/components/ActionButton"
import { DialogTrigger } from "@/components/ui/dialog"
import { useUpdateSectionOrders } from "@/features/admin/courses/hooks/useUpdateSectionOrders";
import { toast } from "sonner";

export default function SortableSectionList({
  courseId,
  sections,
}: {
  courseId: string
  sections: Section[]
}) {

  
  const {mutateAsync: updateOrders} = useUpdateSectionOrders(courseId);

  const handleUpdateOrders = (newOrders:string[])=>{
    return updateOrders(newOrders,{
      onSuccess:(data)=>{
        toast.success(data)
      }
    })
  }
  return (
    <SortableList items={sections} onOrderChange={handleUpdateOrders}>
      {items =>
        items.map(section => (
          <SortableItem
            key={section.id}
            id={section.id}
            className="flex items-center gap-1"
          >
            <div
              className={cn(
                "contents",
                section.status === "private" && "text-muted-foreground"
              )}
            >
              {section.status === "private" && <EyeClosed className="size-4" />}
              {section.name}
            </div>
            <SectionFormDialog section={section} courseId={courseId}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Edit
                </Button>
              </DialogTrigger>
            </SectionFormDialog>
            <ActionButton
              action={()=> console.log("Deleting")}
              requireAreYouSure
              variant="destructive"
              size="sm"
              isLoading={false}
            >
              <Trash2Icon />
              <span className="sr-only">Delete</span>
            </ActionButton>
          </SortableItem>
        ))
      }
    </SortableList>
  )
}