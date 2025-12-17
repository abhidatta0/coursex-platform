"use client"

import SortableList , { SortableItem } from "@/components/SortableList"
import { Lesson, Section } from "@/features/admin/courses/types";
import { cn } from "@/lib/utils"
import { EyeClosed, Trash2Icon } from "lucide-react"
import { LessonFormDialog } from "./LessonFormDialog"
import { Button } from "@/components/ui/button"
import { ActionButton } from "@/components/ActionButton"
import { DialogTrigger } from "@/components/ui/dialog"

export default function SortableLessonList({
  lessons,
  sections,
}: {
  lessons: Lesson[]
  sections: Section[]
}) {

  return (
    <SortableList items={lessons} onOrderChange={()=>{}}>
      {items =>
        items.map(lesson => (
          <SortableItem
            key={lesson.id}
            id={lesson.id}
            className="flex items-center gap-1"
          >
            <div
              className={cn(
                "contents",
                lesson.status === "private" && "text-muted-foreground"
              )}
            >
              {lesson.status === "private" && <EyeClosed className="size-4" />}
              {lesson.name}
            </div>
            <LessonFormDialog defaultSectionId={lesson.section_id} sections={sections} lesson={lesson}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Edit
                </Button>
              </DialogTrigger>
            </LessonFormDialog>
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