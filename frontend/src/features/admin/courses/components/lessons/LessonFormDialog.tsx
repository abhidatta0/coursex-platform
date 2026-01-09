import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import LessonForm from "./LessonForm";
import { Lesson, Section } from "@/features/admin/courses/types";

interface Props {
  defaultSectionId: string;
  children: ReactNode;
  sections: Section[];
  lesson?: Lesson;
}
export function LessonFormDialog({
  defaultSectionId,
  sections,
  lesson,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent aria-describedby="section-dialog" className="sm:min-w-lg">
        <DialogHeader>
          <DialogTitle>
            {lesson == null ? "New Lesson" : `Edit ${lesson.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <LessonForm
            sections={sections}
            defaultSectionId={defaultSectionId}
            lesson={lesson}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
